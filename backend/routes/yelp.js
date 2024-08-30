const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.get('/yelp-restaurants', async (req, res) => {
  const { latitude, longitude, term = 'gluten-free' } = req.query;
  const url = `https://api.yelp.com/v3/businesses/search?term=${encodeURIComponent(term)}&latitude=${latitude}&longitude=${longitude}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Yelp' });
  }
});

module.exports = router;