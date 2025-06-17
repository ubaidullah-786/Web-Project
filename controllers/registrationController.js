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

    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      mobile: req.body.mobile,
      email: req.body.email,
      password: hash,
    });

    req.session.user = {
      id: user._id,
      name: user.firstName,
    };

    req.flash('success', `Welcome, ${user.firstName}!`);

    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('danger', 'Something went wrong');
    res.redirect('/register');
  }
};
