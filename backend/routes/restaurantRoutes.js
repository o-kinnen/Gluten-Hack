const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middlewares/auth');

// Route pour ajouter les restaurants depuis l'API Google Places
router.post('/add-from-api', authMiddleware, restaurantController.addRestaurantsFromAPI);

// Route pour obtenir tous les restaurants
router.get('/', authMiddleware, restaurantController.getAllRestaurants);

module.exports = router;
