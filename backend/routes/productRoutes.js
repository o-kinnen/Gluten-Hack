const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/auth');

// Route pour ajouter un produit
router.post('/add', authMiddleware, productController.addProduct);

module.exports = router;
