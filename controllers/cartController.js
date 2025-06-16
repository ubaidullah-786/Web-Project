const Product = require('../models/productModel');
exports.addCartProduct = async (req, res) => {
  try {
    // 1) Ensure session exists
    if (!req.session.cart) req.session.cart = [];

    // 2) Lookup product
    const prod = await Product.findById(req.params.id).lean();
    if (!prod) return res.status(404).json({ error: 'Product not found' });

    // 3) Find existing entry
    const idx = req.session.cart.findIndex(
      item => item.productId === prod._id.toString()
    );
    if (idx > -1) {
      // increment
      req.session.cart[idx].qty += 1;
    } else {
      // new
      req.session.cart.push({
        productId: prod._id.toString(),
        title: prod.title,
        price: prod.price,
        qty: 1,
      });
    }

    const message = `"${prod.title}" added to cart`;
    const totalQty = req.session.cart.reduce((sum, item) => sum + item.qty, 0);

    return res.json({
      success: true,
      cartCount: totalQty,
      message,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.viewCart = (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  res.render('cart', { cart, total });
};

exports.updateCartProduct = (req, res) => {
  console.log('inside update');
  // expects body: { productId, qty }
  const { productId, qty } = req.body;
  if (!req.session.cart) return res.redirect('/cart');
  req.session.cart = req.session.cart
    .map(item =>
      item.productId === productId ? { ...item, qty: Number(qty) } : item
    )
    .filter(item => item.qty > 0);

  req.flash('success', 'Cart updated');
  res.redirect('/cart');
};
