const mongoose = require('mongoose');

// Optional: If you need a generic catalog item distinct from Product
const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  sku: { type: String, unique: true, sparse: true },
  basePrice: { type: Number, required: true, min: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);