const request = require('supertest');
const express = require('express');
const authMiddleware = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const userRoutes = require('../routes/userRoutes'); // Supposons que vous avez une route protégée par le middleware

jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('devrait refuser l’accès si aucun token n’est fourni', () => {
    req.cookies.token = null;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Accès refusé. Aucun token fourni.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('devrait appeler next si le token est valide', () => {
    const decoded = { id: 1, email: 'test@example.com' };
    req.cookies.token = 'valid_token';
    jwt.verify.mockReturnValue(decoded);

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid_token', process.env.JWT_SECRET);
    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
  });

  it('devrait refuser l’accès si le token est invalide ou expiré', () => {
    req.cookies.token = 'invalid_token';
    jwt.verify.mockImplementation(() => {
      throw new Error('Token invalide');
    });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('invalid_token', process.env.JWT_SECRET);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Accès refusé. Token invalide ou expiré.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('devrait gérer les erreurs et refuser l’accès', () => {
    req.cookies.token = 'some_token';
    const error = new Error('Test error');
    jwt.verify.mockImplementation(() => {
      throw error;
    });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('some_token', process.env.JWT_SECRET);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Accès refusé. Token invalide ou expiré.' });
    expect(next).not.toHaveBeenCalled();
  });

  // Tests d'intégration
  describe('Tests d\'intégration avec authMiddleware', () => {
    let app;

    beforeAll(() => {
      app = express();
      app.use(express.json());

      // Route de test protégée par le middleware d'authentification
      app.get('/protected', authMiddleware, (req, res) => {
        res.status(200).json({ message: 'Accès autorisé' });
      });
    });

    it('devrait refuser l’accès à une route protégée sans token', async () => {
      const response = await request(app).get('/protected');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Accès refusé. Aucun token fourni.' });
    });

    it('devrait autoriser l’accès à une route protégée avec un token valide', async () => {
      jwt.verify.mockReturnValue({ id: 1, email: 'test@example.com' });

      const response = await request(app)
        .get('/protected')
        .set('Cookie', ['token=valid_token']);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Accès autorisé' });
      expect(jwt.verify).toHaveBeenCalledWith('valid_token', process.env.JWT_SECRET);
    });

    it('devrait refuser l’accès à une route protégée avec un token invalide', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Token invalide');
      });

      const response = await request(app)
        .get('/protected')
        .set('Cookie', ['token=invalid_token']);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Accès refusé. Token invalide ou expiré.' });
    });
  });
});

