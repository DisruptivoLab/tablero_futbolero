const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Acceso denegado. Inicia sesión.' });
};

const ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(400).json({ message: 'Ya tienes una sesión activa' });
  }
  next();
};

module.exports = { ensureAuthenticated, ensureGuest };