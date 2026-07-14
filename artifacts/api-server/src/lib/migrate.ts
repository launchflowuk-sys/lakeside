import { pool } from "@workspace/db";
import { logger } from "./logger";

export async function runMigrations(): Promise<void> {
  const client = await pool.connect();
  try {
    logger.info("Running database migrations…");

    // ── Enum types ─────────────────────────────────────────────────────────
    await client.query(`DO $$ BEGIN CREATE TYPE lead_status AS ENUM ('new','contacted','quoted','booked','completed','cancelled','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
    await client.query(`DO $$ BEGIN CREATE TYPE journey_type AS ENUM ('local','airport','school_run','corporate','cruise_terminal','other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
    await client.query(`DO $$ BEGIN CREATE TYPE contact_method AS ENUM ('phone','whatsapp','email'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
    await client.query(`DO $$ BEGIN CREATE TYPE corporate_app_status AS ENUM ('new','reviewing','approved','rejected','on_hold'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
    await client.query(`DO $$ BEGIN CREATE TYPE organisation_type AS ENUM ('business','school','council','nhs','charity','other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
    await client.query(`DO $$ BEGIN CREATE TYPE quote_status AS ENUM ('pending','accepted','paid','expired','cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
    // Safety net: add the 'paid' value to installs where quote_status was
    // created before it existed. ALTER TYPE ... ADD VALUE cannot run inside
    // the same transaction as an earlier use of the type, but each query()
    // call here is its own auto-committed statement, so this is safe.
    await client.query(`ALTER TYPE quote_status ADD VALUE IF NOT EXISTS 'paid'`);

    // ── Detect and fix old leads schema ───────────────────────────────────
    // If the table was created with the old column names ('name' instead of
    // 'full_name'), drop dependents and recreate with the correct schema.
    // Safe because no real leads exist yet in production.
    const { rowCount } = await client.query(`
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name   = 'leads'
        AND column_name  = 'name'
    `);

    if (rowCount && rowCount > 0) {
      logger.info("Old leads schema detected — dropping and recreating leads tables");
      await client.query(`DROP TABLE IF EXISTS quotes CASCADE`);
      await client.query(`DROP TABLE IF EXISTS lead_replies CASCADE`);
      await client.query(`DROP TABLE IF EXISTS leads CASCADE`);
    }

    // ── leads ──────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id                         SERIAL PRIMARY KEY,
        created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        status                     lead_status NOT NULL DEFAULT 'new',
        journey_type               journey_type NOT NULL,
        pickup_location            TEXT NOT NULL,
        destination                TEXT NOT NULL,
        via_stops                  TEXT,
        journey_date               TEXT NOT NULL,
        journey_time               TEXT NOT NULL,
        return_required            BOOLEAN NOT NULL DEFAULT FALSE,
        return_date                TEXT,
        return_time                TEXT,
        passengers                 INTEGER NOT NULL DEFAULT 1,
        luggage                    TEXT,
        child_seats_required       BOOLEAN NOT NULL DEFAULT FALSE,
        accessibility_requirements TEXT,
        additional_notes           TEXT,
        full_name                  TEXT NOT NULL,
        mobile                     TEXT NOT NULL,
        email                      TEXT NOT NULL,
        preferred_contact_method   contact_method NOT NULL DEFAULT 'phone',
        quoted_price               TEXT,
        admin_notes                TEXT,
        assigned_driver            TEXT,
        booking_reference          TEXT
      )
    `);

    // Safety net: add columns that may be missing on existing correct-schema tables
    await client.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS child_seats_required BOOLEAN NOT NULL DEFAULT FALSE`);
    await client.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS accessibility_requirements TEXT`);
    await client.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS additional_notes TEXT`);
    await client.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS booking_reference TEXT`);

    // ── admin_users ────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id            SERIAL PRIMARY KEY,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        email         TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name          TEXT NOT NULL DEFAULT 'Admin',
        role          TEXT NOT NULL DEFAULT 'admin'
      )
    `);
    await client.query(`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT 'Admin'`);
    await client.query(`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin'`);

    // ── lead_replies ───────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS lead_replies (
        id           SERIAL PRIMARY KEY,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        lead_id      INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        subject      TEXT NOT NULL,
        message      TEXT NOT NULL,
        quoted_price TEXT,
        sent_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        sent_by      TEXT NOT NULL DEFAULT 'admin'
      )
    `);
    await client.query(`ALTER TABLE lead_replies ADD COLUMN IF NOT EXISTS subject TEXT NOT NULL DEFAULT ''`);
    await client.query(`ALTER TABLE lead_replies ADD COLUMN IF NOT EXISTS message TEXT NOT NULL DEFAULT ''`);
    await client.query(`ALTER TABLE lead_replies ADD COLUMN IF NOT EXISTS quoted_price TEXT`);
    await client.query(`ALTER TABLE lead_replies ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`);

    // ── quotes ─────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS quotes (
        id                    SERIAL PRIMARY KEY,
        created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        quote_ref             TEXT NOT NULL UNIQUE,
        lead_id               INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
        status                quote_status NOT NULL DEFAULT 'pending',
        customer_name         TEXT NOT NULL,
        customer_email        TEXT NOT NULL,
        customer_mobile       TEXT NOT NULL,
        pickup_location       TEXT NOT NULL,
        destination           TEXT NOT NULL,
        via_stops             TEXT,
        journey_date          TEXT NOT NULL,
        journey_time          TEXT NOT NULL,
        return_required       TEXT NOT NULL DEFAULT 'no',
        return_date           TEXT,
        return_time           TEXT,
        passengers            INTEGER NOT NULL DEFAULT 1,
        journey_type          TEXT NOT NULL,
        price                 TEXT NOT NULL,
        price_notes           TEXT,
        payment_cash          TEXT DEFAULT 'yes',
        payment_card          TEXT DEFAULT 'no',
        payment_bank_transfer TEXT DEFAULT 'no',
        bank_sort_code        TEXT,
        bank_account_number   TEXT,
        bank_account_name     TEXT,
        valid_until           TEXT NOT NULL,
        admin_message         TEXT,
        accepted_at           TIMESTAMPTZ,
        paid_at               TIMESTAMPTZ
      )
    `);
    // Safety net: convert pre-existing installs that had status as TEXT
    await client.query(`DO $$ BEGIN
      ALTER TABLE quotes ALTER COLUMN status TYPE quote_status USING status::quote_status;
      ALTER TABLE quotes ALTER COLUMN status SET DEFAULT 'pending';
    EXCEPTION WHEN others THEN NULL; END $$`);
    // Safety net: add paid_at to pre-existing installs
    await client.query(`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ`);

    // ── corporate_applications ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS corporate_applications (
        id                          SERIAL PRIMARY KEY,
        created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        status                      corporate_app_status NOT NULL DEFAULT 'new',
        company_name                TEXT NOT NULL,
        organisation_type           organisation_type NOT NULL,
        company_address             TEXT NOT NULL,
        city                        TEXT NOT NULL,
        postcode                    TEXT NOT NULL,
        website                     TEXT,
        contact_name                TEXT NOT NULL,
        job_title                   TEXT,
        email                       TEXT NOT NULL,
        phone                       TEXT NOT NULL,
        estimated_monthly_journeys  TEXT NOT NULL,
        journey_types               TEXT NOT NULL,
        number_of_passengers        TEXT,
        preferred_billing           TEXT NOT NULL DEFAULT 'monthly',
        contract_start_date         TEXT,
        existing_provider_details   TEXT,
        additional_requirements     TEXT,
        admin_notes                 TEXT,
        assigned_to                 TEXT
      )
    `);
    // Safety net: convert pre-existing installs that had status/organisation_type as TEXT
    await client.query(`DO $$ BEGIN
      ALTER TABLE corporate_applications ALTER COLUMN status TYPE corporate_app_status USING status::corporate_app_status;
      ALTER TABLE corporate_applications ALTER COLUMN status SET DEFAULT 'new';
    EXCEPTION WHEN others THEN NULL; END $$`);
    await client.query(`DO $$ BEGIN
      ALTER TABLE corporate_applications ALTER COLUMN organisation_type TYPE organisation_type USING organisation_type::organisation_type;
    EXCEPTION WHEN others THEN NULL; END $$`);

    // ── admin_sessions ─────────────────────────────────────────────────────
    // Managed here rather than via connect-pg-simple's createTableIfMissing
    // option, because that option reads a SQL file from disk at runtime which
    // does not exist inside the esbuild bundle (ENOENT /app/dist/table.sql).
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        sid    VARCHAR   NOT NULL COLLATE "default",
        sess   JSON      NOT NULL,
        expire TIMESTAMP(6) NOT NULL,
        CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE
      ) WITH (OIDS=FALSE)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON admin_sessions (expire)
    `);

    logger.info("Database migrations complete");
  } catch (err) {
    logger.error({ err }, "Database migration failed — server will still start");
  } finally {
    client.release();
  }
}
