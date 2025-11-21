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


//************************************************* *//

// const express = require('express');
// const router = express.Router();
// const Product = require('../models/Product');
// const User = require('../models/User');
// const auth = require('../middleware/middleware');

// // GET /api/cart
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

// // POST /api/cart
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

// // DELETE /api/cart/:productId
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

//******************************************** *//

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/middleware');

// All cart routes require authentication
router.use(auth);

// GET /api/cart - Get user's cart
router.get('/', async (req, res) => {
  try {
    console.log('\n📦 GET /api/cart');
    console.log('User ID:', req.user.id);
    
    const user = await User.findById(req.user.id).populate('cart.product');
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log('✅ Cart retrieved, items:', user.cart.length);
    res.json(user.cart);
  } catch (err) {
    console.error('❌ Get cart error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// POST /api/cart - Add item to cart
router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    console.log('\n➕ POST /api/cart');
    console.log('User ID:', req.user.id);
    console.log('Product ID:', productId);
    console.log('Quantity:', quantity);

    if (!productId) {
      console.log('❌ Missing product ID');
      return res.status(400).json({ msg: 'Product ID is required' });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      console.log('❌ Product not found');
      return res.status(404).json({ msg: 'Product not found' });
    }

    console.log('✅ Product found:', product.name);

    // Find user and update cart
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log('✅ User found:', user.email);

    // Check if product already in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      user.cart[existingItemIndex].quantity += quantity;
      console.log('📝 Updated quantity:', user.cart[existingItemIndex].quantity);
    } else {
      // Add new item
      user.cart.push({ product: productId, quantity });
      console.log('➕ Added new item');
    }

    await user.save();
    
    // Populate and return updated cart
    await user.populate('cart.product');

    console.log('✅ Cart updated, total items:', user.cart.length);
    res.json(user.cart);
  } catch (err) {
    console.error('❌ Add to cart error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// PUT /api/cart/:productId - Update quantity
router.put('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    console.log('\n✏️ PUT /api/cart/:productId');
    console.log('Product ID:', productId);
    console.log('New quantity:', quantity);

    if (!quantity || quantity < 1) {
      return res.status(400).json({ msg: 'Valid quantity required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Item not in cart' });
    }

    user.cart[itemIndex].quantity = quantity;
    await user.save();
    await user.populate('cart.product');

    console.log('✅ Quantity updated');
    res.json(user.cart);
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/cart/:productId - Remove item
router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    console.log('\n🗑️ DELETE /api/cart/:productId');
    console.log('Product ID:', productId);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.cart = user.cart.filter(
      item => item.product.toString() !== productId
    );

    await user.save();
    await user.populate('cart.product');

    console.log('✅ Item removed');
    res.json(user.cart);
  } catch (err) {
    console.error('❌ Remove error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/cart/clear - Clear cart
router.post('/clear', async (req, res) => {
  try {
    console.log('\n🧹 POST /api/cart/clear');

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.cart = [];
    await user.save();

    console.log('✅ Cart cleared');
    res.json({ msg: 'Cart cleared', cart: [] });
  } catch (err) {
    console.error('❌ Clear error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;