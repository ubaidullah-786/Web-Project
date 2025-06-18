const Order = require('../models/orderModel');
const User = require('../models/userModel');

exports.getPage = (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  res.render('checkout', { cart, total });
};

exports.createOrder = async (req, res) => {
  try {
    const cart = req.session.cart || [];

    const { name, phone, address } = req.body;
    if (!name.trim() || !address.trim()) {
      req.flash('danger', 'Please enter your name and address');
      return res.redirect('/checkout');
    }

    const customer = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
    };

    await Order.create({
      sessionId: req.sessionID,
      userId: req.session.user?.id || null,
      items: cart,
      customer,
      status: 'pending',
    });

    req.session.cart = [];

    if (req.session.user) {
      await User.findByIdAndUpdate(
        req.session.user.id,
        { cart: req.session.cart },
        { new: false }
      );
    }

    req.flash('success', 'Order placed! Thank you for shopping.');
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    req.flash('danger', 'Failed to place order, please try again');
    res.redirect('/checkout');
  }
};
