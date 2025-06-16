const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.route('/').get(cartController.viewCart);
router.route('/add/:id').post(cartController.addCartProduct);
router.route('/update').post(cartController.updateCartProduct);

module.exports = router;
