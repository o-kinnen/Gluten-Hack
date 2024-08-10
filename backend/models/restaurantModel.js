const pool = require('../utils/database');

const Restaurant = {
  create: async (restaurant) => {
    const result = await pool.query(
      'INSERT INTO public."Restaurant" (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *',
      [restaurant.name, restaurant.address, restaurant.latitude, restaurant.longitude]
    );
    console.log(`Insertion DB : ${result.rows[0].name}`);
    return result.rows[0];
  },
  getAll: async () => {
    const result = await pool.query('SELECT * FROM public."Restaurant"');
    return result.rows;
  }
};

module.exports = Restaurant;
