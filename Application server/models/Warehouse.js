const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  warehouseId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true,
    index: true
  },
  operatingRadius: {
    type: Number,
    default: 10 // in kilometers
  },
  isActive: {
    type: Boolean,
    default: true
  },
  capacity: {
    type: Number,
    default: 1000
  },
  currentOrders: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

// Index for geospatial queries
warehouseSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

module.exports = mongoose.model('Warehouse', warehouseSchema);