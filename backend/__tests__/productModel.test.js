const Product = require('../models/productModel');
const pool = require('../utils/database');

jest.mock('../utils/database');

describe('Product Model', () => {
  
  describe('findByBarcode', () => {
    it('devrait retourner un produit basé sur le code-barres', async () => {
      const mockProduct = { id: 1, name: 'Product1', code_barre: '123456789', gluten: false };
      pool.query.mockResolvedValue({ rows: [mockProduct] });

      const result = await Product.findByBarcode('123456789');

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM public."Produit" WHERE code_barre = $1', ['123456789']);
      expect(result).toEqual(mockProduct);
    });

    it('devrait retourner undefined si aucun produit n’est trouvé', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await Product.findByBarcode('987654321');

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM public."Produit" WHERE code_barre = $1', ['987654321']);
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('devrait créer un nouveau produit et le retourner', async () => {
      const mockProduct = { name: 'Product2', code_barre: '987654321', gluten: true };
      const insertedProduct = { id: 2, ...mockProduct };
      pool.query.mockResolvedValue({ rows: [insertedProduct] });

      const result = await Product.create(mockProduct);

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO public."Produit" (name, code_barre, gluten) VALUES ($1, $2, $3) RETURNING *',
        [mockProduct.name, mockProduct.code_barre, mockProduct.gluten]
      );
      expect(result).toEqual(insertedProduct);
    });

    it('devrait lancer une erreur si la création échoue', async () => {
      const mockProduct = { name: 'Product2', code_barre: '987654321', gluten: true };
      const error = new Error('Test error');
      pool.query.mockRejectedValue(error);

      await expect(Product.create(mockProduct)).rejects.toThrow('Test error');
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO public."Produit" (name, code_barre, gluten) VALUES ($1, $2, $3) RETURNING *',
        [mockProduct.name, mockProduct.code_barre, mockProduct.gluten]
      );
    });
  });
});
