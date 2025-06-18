// Middleware to check authentication and set user data
exports.checkAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    req.isAuthenticated = true;
    req.user = req.session.user;
  } else {
    req.isAuthenticated = false;
    req.user = null;
  }
  next();
};

// Middleware that redirects to login if not authenticated
exports.redirectIfNotAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect('/login');
  }
};
