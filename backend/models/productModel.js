const pool = require('../utils/database');

const Product = {
  create: async (product) => {
    const result = await pool.query(
      'INSERT INTO public."Produit" (name, code_barre, gluten) VALUES ($1, $2, $3) RETURNING *',
      [product.name, product.code_barre, product.gluten]
    );
    return result.rows[0];
  },
  findByBarcode: async (code_barre) => {
    const result = await pool.query(
      'SELECT * FROM public."Produit" WHERE code_barre = $1',
      [code_barre]
    );
    return result.rows[0];
  },
};

module.exports = Product;

