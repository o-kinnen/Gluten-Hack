const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/auth');

// Route pour vérifier l'existence du produit
router.get('/check/:barcode', authMiddleware, productController.checkProduct);

// Route pour ajouter un produit
router.post('/add', authMiddleware, productController.addProduct);

module.exports = router;
