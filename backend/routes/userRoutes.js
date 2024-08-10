const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

// Route pour obtenir tous les utilisateurs
router.get('/', userController.getAllUsers);

// Route pour créer un nouvel utilisateur
router.post('/register', userController.registerUser);

// Route pour se connecter
router.post('/login', userController.loginUser);

// Routes de profil utilisateur protégées par l'authentification
router.get('/profile', authMiddleware, userController.getUserProfile);

// Route pour envoyer le lien de réinitialisation du mot de passe
router.post('/send-reset-link', userController.sendResetLink);

// Route pour réinitialiser le mot de passe avec le token
router.post('/reset-password', userController.resetPassword);

module.exports = router;