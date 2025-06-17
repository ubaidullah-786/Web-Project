exports.initLocals = (req, res, next) => {
  const hasFlash = req.session && req.session.flash;
  res.locals.success = hasFlash ? req.flash('success') : [];
  res.locals.danger = hasFlash ? req.flash('danger') : [];
  res.locals.user = req.session.user || null;
  const cart = req.session.cart || [];
  res.locals.cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  next();
};
