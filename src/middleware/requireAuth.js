// src/middleware/requireAuth.js
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({
    message: "Unauthorized. Please log in with GitHub to access this resource."
  });
};

module.exports = requireAuth;
