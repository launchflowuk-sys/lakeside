import { pool } from "@workspace/db";
import { logger } from "./logger";

export async function runMigrations(): Promise<void> {
  const client = await pool.connect();
  try {
    logger.info("Running database migrations…");

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE lead_status AS ENUM (
          'new', 'contacted', 'quoted', 'booked', 'completed', 'cancelled'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;

      DO $$ BEGIN
        CREATE TYPE quote_status AS ENUM (
          'pending', 'accepted', 'expired', 'cancelled'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;

      CREATE TABLE IF NOT EXISTS leads (
        id                SERIAL PRIMARY KEY,
        created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        name              TEXT NOT NULL,
        email             TEXT NOT NULL,
        mobile            TEXT NOT NULL,
        pickup_location   TEXT NOT NULL,
        destination       TEXT NOT NULL,
        via_stops         TEXT,
        journey_date      TEXT NOT NULL,
        journey_time      TEXT NOT NULL,
        return_required   TEXT NOT NULL DEFAULT 'no',
        return_date       TEXT,
        return_time       TEXT,
        passengers        INTEGER NOT NULL DEFAULT 1,
        luggage           TEXT,
        journey_type      TEXT NOT NULL,
        extras            TEXT,
        message           TEXT,
        status            lead_status NOT NULL DEFAULT 'new',
        quoted_price      TEXT,
        assigned_driver   TEXT,
        admin_notes       TEXT,
        source            TEXT DEFAULT 'web'
      );

      CREATE TABLE IF NOT EXISTS admin_users (
        id            SERIAL PRIMARY KEY,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        email         TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name          TEXT NOT NULL DEFAULT 'Admin',
        role          TEXT NOT NULL DEFAULT 'admin'
      );

      CREATE TABLE IF NOT EXISTS lead_replies (
        id         SERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        lead_id    INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        body       TEXT NOT NULL,
        sent_by    TEXT NOT NULL DEFAULT 'admin'
      );

      CREATE TABLE IF NOT EXISTS quotes (
        id                   SERIAL PRIMARY KEY,
        created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        quote_ref            TEXT NOT NULL UNIQUE,
        lead_id              INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        status               quote_status NOT NULL DEFAULT 'pending',
        customer_name        TEXT NOT NULL,
        customer_email       TEXT NOT NULL,
        customer_mobile      TEXT NOT NULL,
        pickup_location      TEXT NOT NULL,
        destination          TEXT NOT NULL,
        via_stops            TEXT,
        journey_date         TEXT NOT NULL,
        journey_time         TEXT NOT NULL,
        return_required      TEXT NOT NULL DEFAULT 'no',
        return_date          TEXT,
        return_time          TEXT,
        passengers           INTEGER NOT NULL DEFAULT 1,
        journey_type         TEXT NOT NULL,
        price                TEXT NOT NULL,
        price_notes          TEXT,
        payment_cash         TEXT DEFAULT 'yes',
        payment_card         TEXT DEFAULT 'no',
        payment_bank_transfer TEXT DEFAULT 'no',
        bank_sort_code       TEXT,
        bank_account_number  TEXT,
        bank_account_name    TEXT,
        valid_until          TEXT NOT NULL,
        admin_message        TEXT,
        accepted_at          TIMESTAMPTZ
      );
    `);

    logger.info("Database migrations complete");
  } catch (err) {
    logger.error({ err }, "Database migration failed");
    throw err;
  } finally {
    client.release();
  }
}
