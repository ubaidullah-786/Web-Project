const express = require('express');
const router = express.Router();
const isAdmin = require('../middlewares/isAdmin');
const adminProductCtrl = require('../controllers/adminProductController');
const adminOrderCtrl = require('../controllers/adminOrderController');

router.use((req, res, next) => {
  res.locals.layout = 'adminLayout';
  next();
});

router.get('/products/addForm', isAdmin, adminProductCtrl.renderAddForm);
router.post('/products/delete/:id', isAdmin, adminProductCtrl.deleteProduct);
router.get('/orders', isAdmin, adminOrderCtrl.listOrders);
router.post('/orders/:id/status', isAdmin, adminOrderCtrl.updateStatus);

router
  .route('/products')
  .get(isAdmin, adminProductCtrl.listProducts)
  .post(isAdmin, adminProductCtrl.addProduct);

router
  .route('/products/edit/:id')
  .get(isAdmin, adminProductCtrl.renderEditForm)
  .post(isAdmin, adminProductCtrl.updateProduct);

module.exports = router;
