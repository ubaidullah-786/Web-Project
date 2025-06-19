const Order = require('../models/orderModel');

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.render('adminOrders', { orders });
  } catch (err) {
    req.flash('danger', 'Error loading orders');
    res.redirect('/admin');
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status });
    req.flash('success', 'Order status updated successfully');
    res.redirect('/admin/orders');
  } catch (err) {
    req.flash('danger', 'Error updating order status');
    res.redirect('/admin/orders');
  }
};
