const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/userModel');

router.get('/', (req, res) => res.render('homePage'));
router.get('/contact-us', (req, res) => res.render('contactUs'));
router.get('/register', (req, res) => {
  res.render('register');
});
router.get('/login', (req, res) => res.render('login'));
router.get('/account', (req, res) => res.render('account'));
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

router.post('/register', async (req, res) => {
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
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash('danger', 'No user with that email');
      return res.redirect('/login');
    }

    const ok = await bcrypt.compare(req.body.password, user.password);
    if (!ok) {
      req.flash('danger', 'Invalid password');
      return res.redirect('/login');
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
});

module.exports = router;
