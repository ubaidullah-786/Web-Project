module.exports = function isAdmin(req, res, next) {
  if (
    req.session.user &&
    req.session.user.roles &&
    req.session.user.roles.includes('admin')
  ) {
    return next();
  }
  req.flash('danger', 'Admin access required');
  res.redirect('/login');
};
