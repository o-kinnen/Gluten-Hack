const productController = require('../controllers/productController');
const Product = require('../models/productModel');

jest.mock('../models/productModel');

describe('productController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Mock console.error
    console.error = jest.fn();
  });

  describe('addProduct', () => {
    it('devrait retourner 500 et enregistrer l\'erreur si un problème survient', async () => {
      req.body = {
        name: 'Product2',
        code_barre: '987654321',
        gluten: true,
      };

      const error = new Error('Test error');
      Product.create.mockRejectedValue(error);

      await productController.addProduct(req, res, next);

      // Assurez-vous que console.error a été appelé avec les bons arguments
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Erreur lors de l'ajout du produit :", error);

      // Assurez-vous que le statut de la réponse et le json ont été appelés correctement
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erreur lors de l'ajout du produit." });
    });
  });
});

