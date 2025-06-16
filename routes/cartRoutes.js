const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.route('/').get(cartController.viewCart);
router.route('/update').post(cartController.updateCartProduct);
router.route('/add/:id').post(cartController.addCartProduct);

module.exports = router;
