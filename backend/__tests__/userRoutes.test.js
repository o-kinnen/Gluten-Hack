const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/userRoutes');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

jest.mock('../controllers/userController');
jest.mock('../middlewares/auth');

describe('Test d\'intégration pour les routes utilisateur', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/users', userRoutes);
  });

  beforeEach(() => {
    authMiddleware.mockClear();
    userController.getAllUsers.mockClear();
    userController.registerUser.mockClear();
    userController.loginUser.mockClear();
    userController.logoutUser.mockClear();
    userController.getUserProfile.mockClear();
    userController.sendResetLink.mockClear();
    userController.resetPassword.mockClear();
    userController.deleteUser.mockClear();
    userController.checkAuth.mockClear();
  });

  it('devrait configurer la route GET / avec userController.getAllUsers', async () => {
    userController.getAllUsers.mockImplementation((req, res) => res.status(200).json([{ id: 1, name: 'Test User' }]));

    const response = await request(app).get('/users/');

    expect(userController.getAllUsers).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'Test User' }]);
  });

  it('devrait configurer la route POST /register avec userController.registerUser', async () => {
    userController.registerUser.mockImplementation((req, res) => res.status(201).json({ message: 'Utilisateur enregistré avec succès' }));

    const response = await request(app)
      .post('/users/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'password123' });

    expect(userController.registerUser).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Utilisateur enregistré avec succès');
  });

  it('devrait configurer la route POST /login avec userController.loginUser', async () => {
    userController.loginUser.mockImplementation((req, res) => res.status(200).json({ message: 'Connexion réussie' }));

    const response = await request(app)
      .post('/users/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(userController.loginUser).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Connexion réussie');
  });

  it('devrait configurer la route POST /logout avec userController.logoutUser', async () => {
    userController.logoutUser.mockImplementation((req, res) => res.status(200).json({ message: 'Déconnexion réussie' }));

    const response = await request(app).post('/users/logout');

    expect(userController.logoutUser).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Déconnexion réussie');
  });

  it('devrait configurer la route GET /profile avec authMiddleware et userController.getUserProfile', async () => {
    authMiddleware.mockImplementation((req, res, next) => next());
    userController.getUserProfile.mockImplementation((req, res) => res.status(200).json({ name: 'Test User', email: 'test@example.com' }));

    const response = await request(app).get('/users/profile');

    expect(authMiddleware).toHaveBeenCalled();
    expect(userController.getUserProfile).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Test User');
    expect(response.body).toHaveProperty('email', 'test@example.com');
  });

  it('devrait configurer la route POST /send-reset-link avec userController.sendResetLink', async () => {
    userController.sendResetLink.mockImplementation((req, res) => res.status(200).json({ message: 'Email de réinitialisation envoyé.' }));

    const response = await request(app)
      .post('/users/send-reset-link')
      .send({ email: 'test@example.com' });

    expect(userController.sendResetLink).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Email de réinitialisation envoyé.');
  });

  it('devrait configurer la route POST /reset-password avec userController.resetPassword', async () => {
    userController.resetPassword.mockImplementation((req, res) => res.status(200).json({ success: true, message: 'Mot de passe réinitialisé avec succès.' }));

    const response = await request(app)
      .post('/users/reset-password')
      .send({ token: 'valid-token', newPassword: 'newpassword123' });

    expect(userController.resetPassword).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Mot de passe réinitialisé avec succès.');
  });

  it('devrait configurer la route DELETE /delete avec authMiddleware et userController.deleteUser', async () => {
    authMiddleware.mockImplementation((req, res, next) => next());
    userController.deleteUser.mockImplementation((req, res) => res.status(200).json({ message: 'Compte supprimé avec succès.' }));

    const response = await request(app).delete('/users/delete');

    expect(authMiddleware).toHaveBeenCalled();
    expect(userController.deleteUser).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Compte supprimé avec succès.');
  });

  it('devrait configurer la route GET /check-auth avec authMiddleware et userController.checkAuth', async () => {
    authMiddleware.mockImplementation((req, res, next) => next());
    userController.checkAuth.mockImplementation((req, res) => res.status(200).json({ authenticated: true }));

    const response = await request(app).get('/users/check-auth');

    expect(authMiddleware).toHaveBeenCalled();
    expect(userController.checkAuth).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('authenticated', true);
  });

  it('devrait retourner une erreur 401 si le middleware authMiddleware bloque la requête GET /profile', async () => {
    authMiddleware.mockImplementation((req, res) => res.status(401).json({ message: 'Unauthorized' }));

    const response = await request(app).get('/users/profile');

    expect(authMiddleware).toHaveBeenCalled();
    expect(userController.getUserProfile).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });
});

