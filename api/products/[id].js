const { getDb } = require('../_db');

module.exports = async function handler(req, res) {
  setCors(res, 'PUT, DELETE');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  try {
    const sql = await getDb();

    if (req.method === 'PUT') {
      const { key, product: p } = req.body || {};
      if (key !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'No autorizado' });

      const imagenes = JSON.stringify(Array.isArray(p.imagenes) ? p.imagenes : []);
      const pasos    = JSON.stringify(Array.isArray(p.pasos)    ? p.pasos    : [1]);

      await sql`
        UPDATE products SET
          nombre          = ${p.nombre || ''},
          descripcion     = ${p.descripcion || ''},
          precio          = ${parseFloat(p.precio) || 0},
          imagenes        = ${imagenes},
          categoria       = ${p.categoria || ''},
          stock           = ${parseInt(p.stock) || 0},
          min_unidades    = ${parseInt(p.min_unidades) || 1},
          pasos           = ${pasos},
          variantes       = ${p.variantes || ''},
          variantes_label = ${p.variantes_label || ''},
          orden           = ${parseInt(p.orden) || 0}
        WHERE id = ${id}
      `;

      return res.json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const { key } = req.body || {};
      if (key !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'No autorizado' });

      await sql`UPDATE products SET activo = false WHERE id = ${id}`;
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
