// =====================================================
//  API — Vercel API Routes + Neon PostgreSQL
// =====================================================

const API = {

  async _get(path, params = {}) {
    const url = new URL(CONFIG.API_URL + path, location.origin);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString());
    return res.json();
  },

  async _post(path, data = {}) {
    const res = await fetch(CONFIG.API_URL + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: CONFIG.ADMIN_KEY, ...data }),
    });
    return res.json();
  },

  async _put(path, data = {}) {
    const res = await fetch(CONFIG.API_URL + path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: CONFIG.ADMIN_KEY, ...data }),
    });
    return res.json();
  },

  async _delete(path, data = {}) {
    const res = await fetch(CONFIG.API_URL + path, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: CONFIG.ADMIN_KEY, ...data }),
    });
    return res.json();
  },

  // ── Productos (público) ───────────────────────────────
  async getProducts() {
    return this._get('/products');
  },

  // ── Productos (admin, incluye inactivos) ──────────────
  async getProductsAdmin() {
    return this._get('/products', { admin: '1', key: CONFIG.ADMIN_KEY });
  },

  // ── Config ────────────────────────────────────────────
  async getConfig() {
    return this._get('/config');
  },

  // ── Mutaciones (requieren ADMIN_KEY) ──────────────────
  async addProduct(product) {
    return this._post('/products', { product });
  },

  async updateProduct(product) {
    return this._put(`/products/${product.id}`, { product });
  },

  async deleteProduct(id) {
    return this._delete(`/products/${id}`);
  },

  async reactivateProduct(id) {
    return this._post(`/products/${id}/reactivate`);
  },

  async updateConfig(config) {
    return this._put('/config', config);
  },
};
