const express = require('express');
const router = express.Router();
const registerUser = require('../controllers/registrationController');
const signIn = require('../controllers/signInController');
const Product = require('../models/productModel');

router.get('/', (req, res) => res.render('homePage'));
router.get('/contact-us', (req, res) => res.render('contactUs'));
router.get('/account', (req, res) => res.render('account'));

router.get('/products', async (req, res) => {
  const products = await Product.find().lean();
  console.log(products);
  res.render('products', { products });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

router
  .route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post(registerUser.register);

router
  .route('/login')
  .get((req, res) => res.render('login'))
  .post(signIn.signInUser);

module.exports = router;
