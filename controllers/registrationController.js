const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
exports.register = async (req, res) => {
  try {
    let existing = await User.findOne({ email: req.body.email });
    if (existing) {
      req.flash('danger', 'Email already registered');
      return res.redirect('/register');
    }

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(req.body.password, salt);

    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
    };

    if (req.body.mobile && req.body.mobile.trim() !== '') {
      userData.mobile = req.body.mobile;
    }

    const user = await User.create(userData);

    req.session.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    req.flash('success', `Welcome, ${user.firstName}!`);

    res.redirect('/products');
  } catch (err) {
    console.error(err);
    req.flash('danger', 'Something went wrong');
    res.redirect('/register');
  }
};
