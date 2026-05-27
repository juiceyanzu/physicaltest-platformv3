const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// Lazy-loaded query to avoid circular deps
let _query = null;
function getQuery() {
  if (!_query) _query = require('../config/database').query;
  return _query;
}

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: '未授权' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ success: false, message: '无效token' });
  }

  req.user = decoded;

  // Block frozen users from using existing tokens
  try {
    const rows = await getQuery()('SELECT status FROM users WHERE id = ?', [decoded.id]);
    if (rows.length > 0 && rows[0].status !== 'active') {
      return res.status(403).json({ success: false, message: '用户已冻结' });
    }
  } catch (e) {
    // If DB check fails, allow through (don't block all requests on DB error)
  }

  next();
}

function authorizeRole(roles) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ success: false, message: '无权访问' });
    }
    next();
  };
}

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
  authorizeRole
};