const pool = require('../utils/database');

const User = {
  getAll: async () => {
    const result = await pool.query('SELECT * FROM public."User"');
    return result.rows;
  },
  findByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM public."User" WHERE email = $1', 
      [email]);
    return result.rows[0];
  },
  findById: async (id) => {
    const result = await pool.query('SELECT * FROM public."User" WHERE id_user = $1', 
      [id]);
    return result.rows[0];
  },
  create: async (user) => {
    const result = await pool.query(
      'INSERT INTO public."User" (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [user.name, user.email, user.password]
    );
    return result.rows[0];
  },
  updatePassword: async (email, newPassword) => {
    const result = await pool.query(
      'UPDATE public."User" SET password = $1 WHERE email = $2 RETURNING *',
      [newPassword, email]
    );
    return result.rows[0];
  }
};

module.exports = User;