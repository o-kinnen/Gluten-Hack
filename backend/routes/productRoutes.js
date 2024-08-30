const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/auth');

router.get('/check/:barcode', authMiddleware, productController.checkProduct);
router.post('/add', authMiddleware, productController.addProduct);
router.get('/user', authMiddleware, productController.getUserProducts);
router.delete('/user', authMiddleware, productController.deleteUserProducts);

module.exports = router;
