import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

let _pool: pg.Pool | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getPool(): pg.Pool {
  if (!_pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?",
      );
    }
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      // Without this, a request waiting for a free connection waits forever
      // instead of failing fast — the actual cause of the "everything hangs"
      // incidents: once idle connections leak (see the error handler below),
      // every subsequent query queues for a slot that will never free up.
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 30_000,
    });
    // node-postgres requires an error listener on the pool. Without one, a
    // pooled connection that dies in the background (a brief network blip,
    // anything disrupting the container) leaks that slot forever — Postgres
    // itself cleans up the dead connection, but the Pool object never learns
    // its slot is free, so it slowly exhausts over uptime even though
    // Postgres shows a healthy, low connection count throughout.
    _pool.on("error", (err) => {
      // eslint-disable-next-line no-console
      console.error("Unexpected error on idle Postgres client", err);
    });
  }
  return _pool;
}

export function getDb(): ReturnType<typeof drizzle<typeof schema>> {
  if (!_db) {
    _db = drizzle(getPool(), { schema });
  }
  return _db;
}

export { schema };
export * from "./schema";

export const pool = new Proxy({} as pg.Pool, {
  get(_t, prop) {
    return (getPool() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_t, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
