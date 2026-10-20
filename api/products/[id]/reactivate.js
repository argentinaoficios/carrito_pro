const { getDb } = require('../../_db');

module.exports = async function handler(req, res) {
  setCors(res, 'POST');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { id } = req.query;
  const { key } = req.body || {};
  if (key !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'No autorizado' });

  try {
    const sql = await getDb();
    await sql`UPDATE products SET activo = true WHERE id = ${id}`;
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

function setCors(res, methods) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', methods + ', OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
