const express = require('express');
const router = express.Router();
const registerUser = require('../controllers/registrationController');
const signIn = require('../controllers/signInController');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');

router.get('/', (req, res) => res.render('homePage'));
router.get('/contact-us', (req, res) => res.render('contactUs'));
router.get('/account', (req, res) => res.render('account'));

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

// GET checkout form
router.get('/checkout', (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  res.render('checkout', { cart, total });
});

// POST place order
router.post('/checkout', async (req, res) => {
  const cart = req.session.cart || [];
  if (!cart.length) {
    req.flash('danger', 'Your cart is empty');
    return res.redirect('/cart');
  }
  const { name, phone, address } = req.body;
  // create order
  await Order.create({
    sessionId: req.sessionID,
    items: cart,
    total,
    customer: { name, phone, address },
    status: 'pending',
  });
  // clear cart
  req.session.cart = [];
  req.flash('success', 'Order placed—thank you!');
  res.redirect('/');
});
module.exports = router;
