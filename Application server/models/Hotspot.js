const mongoose = require('mongoose');

const hotspotSchema = new mongoose.Schema({
  hotspotId: {
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
  coverageRadius: {
    type: Number,
    default: 5 // in kilometers
  },
  isActive: {
    type: Boolean,
    default: true
  },
  deliveryPartners: {
    type: Number,
    default: 10
  },
  activeDeliveries: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

// Index for geospatial queries
hotspotSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

module.exports = mongoose.model('Hotspot', hotspotSchema);