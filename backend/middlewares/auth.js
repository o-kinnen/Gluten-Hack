const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Auth Header:', authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
  }
  const token = authHeader.split(' ')[1];
  console.log('Token:', token);
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Token invalide.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded);
    req.user = decoded; 
    next();
  } catch (error) {
    console.log('Error verifying token:', error);
    res.status(401).json({ message: 'Accès refusé. Token invalide ou expiré.' });
  }
};

module.exports = authMiddleware;