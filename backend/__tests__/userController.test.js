const userController = require('../controllers/userController');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

jest.mock('../models/userModel');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('nodemailer');

describe('userController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, cookies: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    next = jest.fn();
  });

  describe('sendResetLink', () => {
    it('devrait envoyer un lien de réinitialisation de mot de passe', async () => {
      const user = { email: 'test@example.com' };
      req.body.email = 'test@example.com';
      User.findByEmail.mockResolvedValue(user);
      jwt.sign.mockReturnValue('reset_token');
      const sendMailMock = jest.fn().mockResolvedValueOnce(true);
      nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

      await userController.sendResetLink(req, res, next);

      expect(User.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(jwt.sign).toHaveBeenCalledWith({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
      expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({ to: 'test@example.com' }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email de réinitialisation envoyé.' });
    });

    it('devrait retourner une erreur si l’utilisateur n’est pas trouvé', async () => {
      req.body.email = 'unknown@example.com';
      User.findByEmail.mockResolvedValue(null);

      await userController.sendResetLink(req, res, next);

      expect(User.findByEmail).toHaveBeenCalledWith('unknown@example.com');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé.' });
    });

    it('devrait appeler next avec une erreur en cas de problème', async () => {
      const error = new Error('Test error');
      User.findByEmail.mockRejectedValue(error);

      await userController.sendResetLink(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('resetPassword', () => {
    it('devrait réinitialiser le mot de passe', async () => {
      const user = { email: 'test@example.com' };
      req.body = { token: 'valid_token', newPassword: 'NewPass123!' };
      jwt.verify.mockReturnValue({ email: 'test@example.com' });
      User.findByEmail.mockResolvedValue(user);
      bcrypt.hash.mockResolvedValue('hashed_password');

      await userController.resetPassword(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('valid_token', process.env.JWT_SECRET);
      expect(User.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('NewPass123!', 10);
      expect(User.updatePassword).toHaveBeenCalledWith(user.email, 'hashed_password');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Mot de passe réinitialisé avec succès.' });
    });

    it('devrait retourner une erreur si le token est invalide ou expiré', async () => {
      req.body = { token: 'invalid_token', newPassword: 'NewPass123!' };
      jwt.verify.mockImplementation(() => { throw new jwt.JsonWebTokenError('Token invalide'); });

      await userController.resetPassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Token invalide.' });
    });

    it('devrait retourner une erreur si l’utilisateur n’est pas trouvé', async () => {
      req.body = { token: 'valid_token', newPassword: 'NewPass123!' };
      jwt.verify.mockReturnValue({ email: 'unknown@example.com' });
      User.findByEmail.mockResolvedValue(null);

      await userController.resetPassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé.' });
    });

    test('devrait appeler next avec une erreur en cas de problème', async () => {
        const req = {
          body: {
            token: 'valid-token',
            newPassword: 'newpassword123'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
        const next = jest.fn();
      
        // Mock User.findByEmail to throw an error
        User.findByEmail.mockRejectedValue(new Error('Test error'));
      
        await userController.resetPassword(req, res, next);
      
        // Ensure next was called with the error
        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next).toHaveBeenCalledWith(new Error('Test error'));
      });
      
  });

  describe('deleteUser', () => {
    it('devrait supprimer un utilisateur', async () => {
      req.user.id = 1;
      const user = { id: 1 };
      User.findById.mockResolvedValue(user);

      await userController.deleteUser(req, res, next);

      expect(User.findById).toHaveBeenCalledWith(1);
      expect(User.delete).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Compte supprimé avec succès.' });
    });

    it('devrait retourner une erreur si l’utilisateur n’est pas trouvé', async () => {
      req.user.id = 1;
      User.findById.mockResolvedValue(null);

      await userController.deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé.' });
    });

    it('devrait appeler next avec une erreur en cas de problème', async () => {
      const error = new Error('Test error');
      req.user.id = 1;
      User.findById.mockRejectedValue(error);

      await userController.deleteUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('logoutUser', () => {
    it('devrait déconnecter l’utilisateur', () => {
      userController.logoutUser(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('token');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Déconnexion réussie' });
    });
  });

  describe('checkAuth', () => {
    it('devrait retourner le statut authentifié', async () => {
      await userController.checkAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ authenticated: true });
    });

    it('devrait appeler next avec une erreur en cas de problème', async () => {
      const error = new Error('Test error');
      res.status.mockImplementation(() => { throw error; });

      await userController.checkAuth(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
