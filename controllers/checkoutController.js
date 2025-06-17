const Order = require('../models/orderModel');

exports.getPage = (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  res.render('checkout', { cart, total });
};

exports.createOrder = async (req, res) => {
  try {
    const cart = req.session.cart || [];
    if (!cart.length) {
      req.flash('danger', 'Your cart is empty');
      return res.redirect('/cart');
    }

    const { name, phone, address } = req.body;
    if (!name.trim() || !address.trim()) {
      req.flash('danger', 'Please enter your name and address');
      return res.redirect('/checkout');
    }

    await Order.create({
      sessionId: req.sessionID,
      userId: req.session.user?.id || null,
      items: cart,
      customer: { name, phone, address },
      status: 'pending',
    });

    req.session.cart = [];

    req.flash('success', 'Order placed! Thank you for shopping.');
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    req.flash('danger', 'Failed to place order, please try again');
    res.redirect('/checkout');
  }
};
