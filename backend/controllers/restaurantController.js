const Restaurant = require('../models/restaurantModel');
const getRestaurants  = require('../utils/getRestaurants');

exports.addRestaurantsFromAPI = async (req, res, next) => {
  try {
    const restaurants = await getRestaurants();
    console.log(restaurants);
    for (const restaurant of restaurants) {
        const newRestaurant = {
          name: restaurant.name,
          address: restaurant.vicinity,
          latitude: restaurant.geometry.location.lat,
          longitude: restaurant.geometry.location.lng,
        };
      await Restaurant.create(newRestaurant);
      console.log(`Restaurant ajouté : ${newRestaurant.name}`);
    }
    res.status(201).json({ message: 'Restaurants ajoutés avec succès.' });
  } catch (error) {
    next(error);
  }
};

exports.getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.getAll();
    res.status(200).json(restaurants);
  } catch (error) {
    next(error);
  }
};
