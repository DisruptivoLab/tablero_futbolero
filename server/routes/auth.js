const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', [
  body('username').isLength({ min: 3 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario o email ya existe' });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });
    
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ 
        user: { 
          id: user._id, 
          username: user.username, 
          email: user.email 
        } 
      });
    });
  })(req, res, next);
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Error al cerrar sesión' });
    res.json({ message: 'Sesión cerrada' });
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      user: { 
        id: req.user._id, 
        username: req.user.username, 
        email: req.user.email 
      } 
    });
  } else {
    res.status(401).json({ message: 'No autenticado' });
  }
});

module.exports = router;