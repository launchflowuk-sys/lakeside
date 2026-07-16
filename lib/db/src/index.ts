import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Eagerly constructed at module load, not lazily behind a Proxy. The lazy
// Proxy indirection (get-only, wrapping getPool()/getDb()) was never
// actually needed in production — DATABASE_URL is always present at
// startup — and was a live, untested suspect for the pool-reuse bug that
// caused queries to stop completing after the first one on any given boot:
// every call through it ran with `this` bound to the Proxy rather than the
// real Pool instance, since `pool.query(...)` resolves the method via the
// Proxy's get trap but calls it with the Proxy itself as the receiver.
// Removing the indirection removes that whole class of risk regardless of
// whether it was the exact mechanism.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  // Without this, a request waiting for a free connection waits forever
  // instead of failing fast — the actual cause of the "everything hangs"
  // incidents: once idle connections leak (see the error handler below),
  // every subsequent query queues for a slot that will never free up.
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000,
  // node-postgres does not enable TCP keepalive by default. Without it, a
  // connection sitting idle in the pool can have its socket silently
  // killed by anything upstream (NAT, firewall, load balancer idle
  // timeout) with neither side finding out — the pool still believes the
  // connection is healthy until a query actually tries to use it.
  keepAlive: true,
  keepAliveInitialDelayMillis: 10_000,
  // Server-side and client-side belt-and-braces: if a connection does go
  // stale and gets handed to a query anyway, these make it fail fast
  // with a clear error instead of hanging the request indefinitely.
  statement_timeout: 30_000,
  query_timeout: 35_000,
  idle_in_transaction_session_timeout: 30_000,
});

// node-postgres requires an error listener on the pool. Without one, a
// pooled connection that dies in the background (a brief network blip,
// anything disrupting the container) leaks that slot forever — Postgres
// itself cleans up the dead connection, but the Pool object never learns
// its slot is free, so it slowly exhausts over uptime even though
// Postgres shows a healthy, low connection count throughout.
pool.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("Unexpected error on idle Postgres client", err);
});

export const db = drizzle(pool, { schema });

export function getDb(): typeof db {
  return db;
}

export { schema };
export * from "./schema";
