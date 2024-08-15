const request = require('supertest');
const express = require('express');
const productRoutes = require('../routes/productRoutes');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/auth');

jest.mock('../controllers/productController');
jest.mock('../middlewares/auth');

describe('Test d\'intégration pour les routes de produits', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/products', productRoutes);
  });

  beforeEach(() => {
    authMiddleware.mockClear();
    productController.checkProduct.mockClear();
    productController.addProduct.mockClear();
  });

  it('devrait protéger la route GET /check/:barcode avec le middleware authMiddleware', async () => {
    authMiddleware.mockImplementation((req, res, next) => next());
    productController.checkProduct.mockImplementation((req, res) => res.status(200).json({ name: 'TestProduct' }));

    const response = await request(app).get('/products/check/123456789');

    expect(authMiddleware).toHaveBeenCalled();
    expect(productController.checkProduct).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'TestProduct');
  });

  it('devrait protéger la route POST /add avec le middleware authMiddleware', async () => {
    authMiddleware.mockImplementation((req, res, next) => next());
    productController.addProduct.mockImplementation((req, res) => res.status(201).json({ id: 1, name: 'NewProduct' }));

    const response = await request(app)
      .post('/products/add')
      .send({ name: 'NewProduct', code_barre: '987654321', gluten: false });

    expect(authMiddleware).toHaveBeenCalled();
    expect(productController.addProduct).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', 'NewProduct');
  });

  it('devrait retourner une erreur 401 si le middleware authMiddleware bloque la requête GET /check/:barcode', async () => {
    authMiddleware.mockImplementation((req, res) => res.status(401).json({ message: 'Unauthorized' }));

    const response = await request(app).get('/products/check/123456789');

    expect(authMiddleware).toHaveBeenCalled();
    expect(productController.checkProduct).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });

  it('devrait retourner une erreur 401 si le middleware authMiddleware bloque la requête POST /add', async () => {
    authMiddleware.mockImplementation((req, res) => res.status(401).json({ message: 'Unauthorized' }));

    const response = await request(app)
      .post('/products/add')
      .send({ name: 'NewProduct', code_barre: '987654321', gluten: false });

    expect(authMiddleware).toHaveBeenCalled();
    expect(productController.addProduct).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });
});
