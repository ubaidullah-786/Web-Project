const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
exports.signInUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.render('login', { danger: ['No such user'] });
    }

    const ok = await bcrypt.compare(req.body.password, user.password);
    if (!ok) {
      return res.render('login', { danger: ['Invalid password'] });
    }

    req.session.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    req.session.cart = user.cart || [];

    req.flash('success', `Welcome back, ${user.firstName}!`);
    res.redirect('/account');
  } catch (err) {
    console.error(err);
    req.flash('danger', 'Login failed');
    res.redirect('/login');
  }
};
