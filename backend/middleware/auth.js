const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'leo_bank_secret_key_2026';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Token tapılmadı' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token etibarsızdır' });
  }
}

module.exports = { authMiddleware, JWT_SECRET };
