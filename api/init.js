const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { key } = req.body || {};
  if (key !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'No autorizado' });

  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id            TEXT PRIMARY KEY,
        nombre        TEXT NOT NULL DEFAULT '',
        descripcion   TEXT DEFAULT '',
        precio        NUMERIC(12,2) NOT NULL DEFAULT 0,
        imagenes      TEXT DEFAULT '[]',
        categoria     TEXT DEFAULT '',
        stock         INTEGER DEFAULT 0,
        min_unidades  INTEGER DEFAULT 1,
        pasos         TEXT DEFAULT '[1]',
        variantes     TEXT DEFAULT '',
        variantes_label TEXT DEFAULT '',
        activo        BOOLEAN DEFAULT true,
        orden         INTEGER DEFAULT 0,
        created_at    TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS store_config (
        id   INTEGER PRIMARY KEY DEFAULT 1,
        data JSONB    DEFAULT '{}'
      )
    `;

    await sql`
      INSERT INTO store_config (id, data)
      VALUES (1, '{}')
      ON CONFLICT DO NOTHING
    `;

    return res.json({ ok: true, message: 'Tablas creadas correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
