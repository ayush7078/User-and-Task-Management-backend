const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Admin-only authorization middleware
const authorizeAdmin = (req, res, next) => {
  if (req.user.username !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
};


// // Admin-only authorization middleware
// const authorizeAdmin = (req, res, next) => {
//   if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
//   next();
// };

// // Role-based authorization middleware
// const authorizeRole = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }
//     next();
//   };
// };

// module.exports = { authenticateJWT, authorizeRole };


module.exports = { authenticateJWT, authorizeAdmin };
