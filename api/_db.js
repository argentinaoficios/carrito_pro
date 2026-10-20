const { neon } = require('@neondatabase/serverless');

let ready = false;

async function getDb() {
  const sql = neon(process.env.DATABASE_URL);

  if (!ready) {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id              TEXT PRIMARY KEY,
        nombre          TEXT NOT NULL DEFAULT '',
        descripcion     TEXT DEFAULT '',
        precio          NUMERIC(12,2) NOT NULL DEFAULT 0,
        imagenes        TEXT DEFAULT '[]',
        categoria       TEXT DEFAULT '',
        stock           INTEGER DEFAULT 0,
        min_unidades    INTEGER DEFAULT 1,
        pasos           TEXT DEFAULT '[1]',
        variantes       TEXT DEFAULT '',
        variantes_label TEXT DEFAULT '',
        activo          BOOLEAN DEFAULT true,
        orden           INTEGER DEFAULT 0,
        created_at      TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS store_config (
        id   INTEGER PRIMARY KEY DEFAULT 1,
        data JSONB DEFAULT '{}'
      )
    `;
    await sql`
      INSERT INTO store_config (id, data)
      VALUES (1, '{}')
      ON CONFLICT DO NOTHING
    `;
    ready = true;
  }

  return sql;
}

module.exports = { getDb };
