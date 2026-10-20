const { getDb } = require('./_db');

module.exports = async function handler(req, res) {
  setCors(res, 'GET, POST');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const sql = await getDb();

    if (req.method === 'GET') {
      const { admin, key } = req.query;
      const isAdmin = admin === '1' && key === process.env.ADMIN_KEY;

      const rows = isAdmin
        ? await sql`SELECT * FROM products ORDER BY orden ASC, created_at ASC`
        : await sql`SELECT * FROM products WHERE activo = true ORDER BY orden ASC, created_at ASC`;

      return res.json({ products: rows.map(parseRow) });
    }

    if (req.method === 'POST') {
      const { key, product: p } = req.body || {};
      if (key !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'No autorizado' });

      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const imagenes = JSON.stringify(Array.isArray(p.imagenes) ? p.imagenes : []);
      const pasos    = JSON.stringify(Array.isArray(p.pasos)    ? p.pasos    : [1]);

      await sql`
        INSERT INTO products
          (id, nombre, descripcion, precio, imagenes, categoria, stock, min_unidades, pasos, variantes, variantes_label, activo, orden)
        VALUES (
          ${id}, ${p.nombre || ''}, ${p.descripcion || ''},
          ${parseFloat(p.precio) || 0}, ${imagenes}, ${p.categoria || ''},
          ${parseInt(p.stock) || 0}, ${parseInt(p.min_unidades) || 1},
          ${pasos}, ${p.variantes || ''}, ${p.variantes_label || ''},
          true, ${parseInt(p.orden) || 0}
        )
      `;

      return res.json({ ok: true, id });
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

function parseRow(row) {
  return {
    ...row,
    precio:       parseFloat(row.precio),
    stock:        parseInt(row.stock),
    min_unidades: parseInt(row.min_unidades),
    orden:        parseInt(row.orden),
    imagenes:     tryParse(row.imagenes, []),
    pasos:        tryParse(row.pasos, [1]),
  };
}

function tryParse(val, fallback) {
  try { return JSON.parse(val); } catch { return fallback; }
}

function setCors(res, methods) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', methods + ', OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
