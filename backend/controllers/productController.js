const Product = require('../models/productModel');

exports.checkProduct = async (req, res, next) => {
  try {
    const { barcode } = req.params;
    const existingProduct = await Product.findByBarcode(barcode);
    if (existingProduct) {
      res.status(200).json(existingProduct);
    } else {
      res.status(404).json({ message: 'Produit non trouvé dans la base de données.' });
    }
  } catch (error) {
    next(error);
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, code_barre, gluten } = req.body;
    const existingProduct = await Product.findByBarcode(code_barre);
    if (existingProduct) {
      return res.status(409).json({ message: 'Le produit avec ce code-barres existe déjà dans la base de données.' });
    }
    const newProduct = await Product.create({ name, code_barre, gluten });
    res.status(201).json(newProduct);  
  } catch (error) {
    console.error('Erreur lors de l\'ajout du produit :', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du produit.' });
  }
};
