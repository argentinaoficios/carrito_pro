const { getDb } = require('./_db');

module.exports = async function handler(req, res) {
  setCors(res, 'GET, PUT');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const sql = await getDb();

    if (req.method === 'GET') {
      const rows = await sql`SELECT data FROM store_config WHERE id = 1`;
      return res.json({ config: rows[0]?.data || {} });
    }

    if (req.method === 'PUT') {
      const { key, ...config } = req.body || {};
      if (key !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'No autorizado' });

      await sql`
        INSERT INTO store_config (id, data)
        VALUES (1, ${JSON.stringify(config)}::jsonb)
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
      `;

      return res.json({ ok: true });
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

function setCors(res, methods) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', methods + ', OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
