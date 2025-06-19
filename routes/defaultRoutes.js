const express = require('express');
const router = express.Router();
const registerUser = require('../controllers/registrationController');
const signIn = require('../controllers/signInController');
const Product = require('../models/productModel');
const Vehicle = require('../models/vehicleModel');
const checkout = require('../controllers/checkoutController');
const account = require('../controllers/accountController');

router.get('/', (req, res) => res.render('homePage'));
router.get('/contact-us', (req, res) => res.render('contactUs'));
router.get('/account', account.renderPage);
router.get('/checkout', checkout.getPage);
router.post('/checkout', checkout.createOrder);

router.get('/products', async (req, res) => {
  const productsList = await Product.find().lean();
  res.render('products', { products: productsList });
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

router.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 }).lean();
    res.render('vehicles', { vehicles, title: 'Our Vehicles' });
  } catch (err) {
    req.flash('danger', 'Error loading vehicles');
    res.redirect('/');
  }
});
module.exports = router;
