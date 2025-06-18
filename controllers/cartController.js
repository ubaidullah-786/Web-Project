const Product = require('../models/productModel');
const User = require('../models/userModel');
exports.addCartProduct = async (req, res) => {
  try {
    if (!req.session.cart) req.session.cart = [];

    if (req.session.user) {
      await User.findByIdAndUpdate(
        req.session.user.id,
        { cart: req.session.cart },
        { new: false }
      );
    }

    const prod = await Product.findById(req.params.id).lean();
    if (!prod) return res.status(404).json({ error: 'Product not found' });

    const idx = req.session.cart.findIndex(
      item => item.productId === prod._id.toString()
    );
    if (idx > -1) {
      req.session.cart[idx].qty += 1;
    } else {
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

exports.updateCartProduct = async (req, res) => {
  const { productId, qty } = req.body;
  if (!req.session.cart) return res.redirect('/cart');
  req.session.cart = req.session.cart
    .map(item =>
      item.productId === productId ? { ...item, qty: Number(qty) } : item
    )
    .filter(item => item.qty > 0);

  if (req.session.user) {
    await User.findByIdAndUpdate(
      req.session.user.id,
      { cart: req.session.cart },
      { new: false }
    );
  }
  req.flash('success', 'Cart updated!');
  res.redirect('/cart');
};
