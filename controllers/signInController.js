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
      name: user.firstName,
    };
    req.flash('success', `Welcome back, ${user.firstName}!`);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('danger', 'Login failed');
    res.redirect('/login');
  }
};
