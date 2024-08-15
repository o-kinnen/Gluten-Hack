const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Ce compte existe déjà' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: newUser.id_user, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: 'Strict',
      maxAge: 3600000
    });
    res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      console.error('User not found with email:', email);
      return res.status(401).json({ message: 'Email incorrect.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error('Incorrect password for email:', email);
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }
    const token = jwt.sign({ id: user.id_user, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: 'Strict',
      maxAge: 3600000
    });
    res.status(200).json({ message: 'Connexion réussie' });
  } catch (error) {
    console.error('Error logging in user:', error);
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({ name: user.name, email: user.email });
  } catch (error) {
    console.log('Error:', error);
    next(error);
  }
};

exports.sendResetLink = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `${process.env.URL_FRONTEND}/reset-password-form?token=${token}`;
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Réinitialisation du mot de passe',
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe (valide pendant 15 minutes) : ${resetLink}.`
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email de réinitialisation envoyé.' });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token et nouveau mot de passe sont requis.' });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(400).json({ message: 'Le lien de réinitialisation a expiré.' });
      }
      return res.status(400).json({ message: 'Token invalide.' });
    }
    const user = await User.findByEmail(decoded.email); 
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user.email, hashedPassword);
    res.status(200).json({ success: true, message: 'Mot de passe réinitialisé avec succès.' });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    await User.delete(userId);
    res.status(200).json({ message: 'Compte supprimé avec succès.' });
  } catch (error) {
    next(error);
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Déconnexion réussie' });
};

exports.checkAuth = async (req, res, next) => {
  try {
    res.status(200).json({ authenticated: true });
  } catch (error) {
    next(error);
  }
};
