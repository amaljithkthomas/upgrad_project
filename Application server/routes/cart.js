// const express = require('express');
// const router = express.Router();
// const Product = require('../models/Product');
// const User = require('../models/User');
// const auth = require('../middleware/middleware'); // Your auth middleware

// // GET /api/cart
// router.get('/', auth, async (req, res) => {
//   const user = await User.findById(req.user).populate('cart.product');
//   res.json(user.cart);
// });

// // POST /api/cart
// router.post('/', auth, async (req, res) => {
//   const { productId, quantity = 1 } = req.body;
//   const user = await User.findById(req.user);
//   const product = await Product.findById(productId);
//   if (!product) return res.status(404).json({ msg: 'Product not found' });
//   if (product.stock < quantity) return res.status(400).json({ msg: 'Out of stock' });

//   const cartItem = user.cart.find(item => item.product.equals(productId));
//   if (cartItem) {
//     cartItem.quantity += quantity;
//   } else {
//     user.cart.push({ product: productId, quantity });
//   }
//   await user.save();
//   res.json(user.cart);
// });

// // DELETE /api/cart/:productId
// router.delete('/:productId', auth, async (req, res) => {
//   const user = await User.findById(req.user);
//   user.cart = user.cart.filter(item => !item.product.equals(req.params.productId));
//   await user.save();
//   res.json(user.cart);
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Product = require('../models/Product');
// const User = require('../models/User');
// const auth = require('../middleware/middleware');

// router.get('/', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).populate('cart.product');
//     if (!user) return res.status(404).json({ msg: 'User not found' });
//     res.json(user.cart);
//   } catch (err) {
//     console.error('Cart GET error:', err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// router.post('/', auth, async (req, res) => {
//   try {
//     const { productId, quantity = 1 } = req.body;
//     if (!productId) return res.status(400).json({ msg: 'productId required' });

//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ msg: 'Product not found' });

//     const qty = parseInt(quantity, 10) || 1;
//     if (product.stock < qty) return res.status(400).json({ msg: 'Out of stock' });

//     const existing = user.cart.find(i => i.product.equals(productId));
//     if (existing) existing.quantity += qty;
//     else user.cart.push({ product: productId, quantity: qty });

//     await user.save();
//     const updated = await User.findById(req.userId).populate('cart.product');
//     res.json(updated.cart);
//   } catch (err) {
//     console.error('Cart POST error:', err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// router.delete('/:productId', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     user.cart = user.cart.filter(i => !i.product.equals(req.params.productId));
//     await user.save();
//     const updated = await User.findById(req.userId).populate('cart.product');
//     res.json(updated.cart);
//   } catch (err) {
//     console.error('Cart DELETE error:', err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/middleware');

// GET /api/cart
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('cart.product');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user.cart);
  } catch (err) {
    console.error('Cart GET error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/cart
router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ msg: 'productId required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    const qty = parseInt(quantity, 10) || 1;
    if (product.stock < qty) return res.status(400).json({ msg: 'Out of stock' });

    const existing = user.cart.find(i => i.product.equals(productId));
    if (existing) existing.quantity += qty;
    else user.cart.push({ product: productId, quantity: qty });

    await user.save();
    const updated = await User.findById(req.userId).populate('cart.product');
    res.json(updated.cart);
  } catch (err) {
    console.error('Cart POST error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/cart/:productId
router.delete('/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.cart = user.cart.filter(i => !i.product.equals(req.params.productId));
    await user.save();

    const updated = await User.findById(req.userId).populate('cart.product');
    res.json(updated.cart);
  } catch (err) {
    console.error('Cart DELETE error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;