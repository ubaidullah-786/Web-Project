const Product = require('../models/productModel');

const availableImages = [
  { class: 'first-img', name: 'First Product Image' },
  { class: 'second-img', name: 'Second Product Image' },
  { class: 'third-img', name: 'Third Product Image' },
  { class: 'fourth-img', name: 'Fourth Product Image' },
  { class: 'fifth-img', name: 'Fifth Product Image' },
  { class: 'sixth-img', name: 'Sixth Product Image' },
  { class: 'seventh-img', name: 'Seventh Product Image' },
  { class: 'eigth-img', name: 'Eighth Product Image' },
];

exports.listProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render('adminProducts', { products });
  } catch (err) {
    req.flash('danger', 'Error loading products');
    res.redirect('/admin');
  }
};

exports.renderAddForm = (req, res) => {
  res.render('addProductForm', {
    product: {},
    action: 'Add',
    availableImages,
  });
};

exports.addProduct = async (req, res) => {
  try {
    const { title, price, image, colors } = req.body;
    await Product.create({
      title,
      price: parseFloat(price),
      image,
      colors: colors ? colors.split(',').map(c => c.trim()) : [],
    });
    req.flash('success', 'Product added successfully');
    res.redirect('/admin/products');
  } catch (err) {
    req.flash('danger', 'Error adding product');
    res.redirect('/admin/products/addForm');
  }
};

exports.renderEditForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      req.flash('danger', 'Product not found');
      return res.redirect('/admin/products');
    }
    res.render('addProductForm', {
      product,
      action: 'Edit',
      availableImages,
    });
  } catch (err) {
    req.flash('danger', 'Error loading product');
    res.redirect('/admin/products');
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { title, price, image, colors } = req.body;
    await Product.findByIdAndUpdate(req.params.id, {
      title,
      price: parseFloat(price),
      image,
      colors: colors ? colors.split(',').map(c => c.trim()) : [],
    });
    req.flash('success', 'Product updated successfully');
    res.redirect('/admin/products');
  } catch (err) {
    req.flash('danger', 'Error updating product');
    res.redirect('/admin/products');
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success', 'Product deleted successfully');
    res.redirect('/admin/products');
  } catch (err) {
    req.flash('danger', 'Error deleting product');
    res.redirect('/admin/products');
  }
};
