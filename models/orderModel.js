const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  sessionId: String,
  userId: String, // optional if guest later logs in
  items: [
    {
      productId: String,
      title: String,
      price: Number,
      qty: Number,
    },
  ],
  customer: {
    name: String,
    phone: String,
    address: String,
  },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
