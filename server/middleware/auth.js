const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async function(req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');

  // Check if not token
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Check if token is in the correct format 'Bearer <token>'
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token format is incorrect' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Add user from payload
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};