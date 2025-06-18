const Order = require('../models/orderModel');
exports.renderPage = async (req, res) => {
  // Check session-based authentication
  const user = req.session.user;
  if (!user) {
    req.flash('danger', 'Please log in to view your account');
    return res.redirect('/login');
  }

  let orders = [];
  try {
    orders = await Order.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .lean();
  } catch (err) {
    console.error('Error fetching orders:', err);
    req.flash('danger', 'Could not load your orders');
  }

  res.render('account', {
    user,
    orders,
  });
};
