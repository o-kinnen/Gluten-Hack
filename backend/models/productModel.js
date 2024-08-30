const pool = require('../utils/database');

const Product = {
  findByBarcodeForUser: async (barcode, userId) => {
    const result = await pool.query(
      'SELECT * FROM public."Product" WHERE barcode = $1 AND user_id = $2',
      [barcode, userId]
    );
    return result.rows[0];
  },
  create: async (product) => {
    const result = await pool.query(
      'INSERT INTO public."Product" (name, barcode, gluten, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [product.name, product.barcode, product.gluten, product.user_id]
    );
    return result.rows[0];
  },
  findByUserId: async (userId) => {
    const result = await pool.query(
      'SELECT * FROM public."Product" WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  },
  deleteByUserId: async (userId) => {
    try {
      const result = await pool.query('DELETE FROM public."Product" WHERE user_id = $1', [userId]);
      return result.rowCount;
    } catch (error) {
      console.error('Erreur SQL lors de la suppression des produits :', error);
      throw error;
    }
  }  
};

module.exports = Product;
