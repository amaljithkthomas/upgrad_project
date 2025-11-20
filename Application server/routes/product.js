const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - Get all products with optional filters
router.get('/', async (req, res) => {
  try {
    const { inStock, minPrice, maxPrice, search } = req.query;
    
    let query = {};
    
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query).lean();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ msg: 'Failed to load products', error: err.message });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid product ID' });
    }
    res.status(500).json({ msg: 'Failed to load product', error: err.message });
  }
});

module.exports = router;