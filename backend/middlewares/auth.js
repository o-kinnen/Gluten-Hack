const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Erreur lors de la vérification du token:', error);
    res.status(401).json({ message: 'Accès refusé. Token invalide ou expiré.' });
  }
};

module.exports = authMiddleware;
