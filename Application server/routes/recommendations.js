const express = require('express');
const router = express.Router();
const auth = require('../middleware/middleware');
const User = require('../models/User');
const Product = require('../models/Product');
const { getRecommendations } = require('../utils/gemini');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    const userHistory = {
      cart: user.cart,
      orders: user.orders || []
    };
    const products = await Product.find({}).lean();
    const recommendedIds = await getRecommendations(userHistory, products);
const recommendedProducts = products.filter(p => recommendedIds.includes(String(p._id)));
    res.json({ recommendations: recommendedProducts });
  } catch (err) {
    console.error('Recommendation route error:', err);
    res.status(500).json({ msg: 'Failed to get recommendations', error: err.message });
  }
});

module.exports = router;