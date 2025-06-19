const express = require('express');
const router = express.Router();
const isAdmin = require('../middlewares/isAdmin');
const adminProductCtrl = require('../controllers/adminProductController');
const adminOrderCtrl = require('../controllers/adminOrderController');
const adminVehicleCtrl = require('../controllers/adminVehicleController');
const multer = require('multer');
const path = require('path');

router.use((req, res, next) => {
  res.locals.layout = 'adminLayout';
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, '..', 'public', 'uploads')),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'vehicle-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
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

router.get('/vehicles/addForm', isAdmin, adminVehicleCtrl.renderAddForm);
router.post('/vehicles/delete/:id', isAdmin, adminVehicleCtrl.deleteVehicle);

router
  .route('/vehicles')
  .get(isAdmin, adminVehicleCtrl.listVehicles)
  .post(isAdmin, upload.single('image'), adminVehicleCtrl.addVehicle);

router
  .route('/vehicles/edit/:id')
  .get(isAdmin, adminVehicleCtrl.renderEditForm)
  .post(isAdmin, upload.single('image'), adminVehicleCtrl.updateVehicle);

module.exports = router;
