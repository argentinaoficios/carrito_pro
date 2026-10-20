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
);

CREATE TABLE IF NOT EXISTS store_config (
  id   INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB DEFAULT '{}'
);

INSERT INTO store_config (id, data)
VALUES (1, '{}')
ON CONFLICT DO NOTHING;
