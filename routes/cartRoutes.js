const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router
  .route('/')
  .get(cartController.viewCart)
  .post(cartController.updateCartProduct);

router.route('/:id').post(cartController.addCartProduct);

module.exports = router;
