const request = require('supertest');
const express = require('express');
const errorHandler = require('../middlewares/errorHandler');

describe('errorHandler', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  // Tests unitaires
  it('devrait retourner une erreur avec le statut spécifié', () => {
    const error = { status: 400, message: 'Bad Request' };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Bad Request' });
  });

  it('devrait retourner une erreur avec le statut 500 si le statut n’est pas spécifié', () => {
    const error = { message: 'Internal Server Error' };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  it('devrait gérer une erreur sans message et retourner un statut 500', () => {
    const error = {};

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: undefined });
  });

  // Tests d'intégration
  describe('Tests d\'intégration avec errorHandler', () => {
    let app;

    beforeAll(() => {
      app = express();

      // Route de test qui génère une erreur intentionnelle
      app.get('/error', (req, res, next) => {
        const error = new Error('Test Error');
        error.status = 400;
        next(error);
      });

      // Utiliser le middleware errorHandler
      app.use(errorHandler);
    });

    it('devrait gérer une erreur 400 via le middleware errorHandler', async () => {
      const response = await request(app).get('/error');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Test Error');
    });

    it('devrait gérer une erreur 500 via le middleware errorHandler sans statut défini', async () => {
      app.get('/error500', (req, res, next) => {
        next(new Error('Erreur interne du serveur'));
      });

      const response = await request(app).get('/error500');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Erreur interne du serveur');
    });
  });
});
