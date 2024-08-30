const Product = require('../models/productModel');

exports.checkProduct = async (req, res, next) => {
  try {
    const { barcode } = req.params;
    const userId = req.user.id;
    const existingProduct = await Product.findByBarcodeForUser(barcode, userId);
    if (existingProduct) {
      res.status(200).json(existingProduct);
    } else {
      res.status(404).json({ message: 'Produit non trouvé pour cet utilisateur dans la base de données.' });
    }
  } catch (error) {
    next(error);
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, barcode, gluten } = req.body;
    const userId = req.user.id;
    const existingProduct = await Product.findByBarcodeForUser(barcode, userId);
    if (existingProduct) {
      return res.status(409).json({ message: 'Le produit avec ce code-barres existe déjà pour cet utilisateur.' });
    }
    const newProduct = await Product.create({ name, barcode, gluten, user_id: userId });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du produit :', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du produit.' });
  }
};

exports.getUserProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await Product.findByUserId(userId);
    res.status(200).json({ products });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des produits.' });
  }
};

exports.deleteUserProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    await Product.deleteByUserId(userId);
    res.status(200).json({ message: 'Historique des produits supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'historique des produits :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'historique des produits.' });
  }
};