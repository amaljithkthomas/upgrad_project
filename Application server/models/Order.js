// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   orderId: {
//     type: String,
//     required: true,
//     unique: true,
//     index: true
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true
//   },
//   items: [{
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product'
//     },
//     name: {
//       type: String,
//       required: true
//     },
//     price: {
//       type: Number,
//       required: true
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       min: 1
//     },
//     subtotal: {
//       type: Number,
//       required: true
//     }
//   }],
//   totalAmount: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   status: {
//     type: String,
//     enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
//     default: 'Processing',
//     index: true
//   },
//   orderPlacedAt: {
//     type: Date,
//     default: Date.now,
//     index: true
//   },
//   estimatedDeliveryTime: {
//     type: Date
//   },
//   deliveredAt: {
//     type: Date
//   },
//   statusHistory: [{
//     status: String,
//     timestamp: {
//       type: Date,
//       default: Date.now
//     },
//     message: String
//   }]
// }, { 
//   timestamps: true 
// });

// // Index for efficient queries
// orderSchema.index({ userId: 1, orderPlacedAt: -1 });

// module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    subtotal: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
    index: true
  },
  // NEW: Warehouse and Hotspot Information
  deliveryInfo: {
    warehouse: {
      warehouseId: String,
      name: String,
      location: {
        latitude: Number,
        longitude: Number
      },
      distance: Number // in km
    },
    hotspot: {
      hotspotId: String,
      name: String,
      location: {
        latitude: Number,
        longitude: Number
      },
      distance: Number // in km
    },
    userLocation: {
      latitude: Number,
      longitude: Number,
      address: String
    },
    totalDistance: Number, // warehouse to user via hotspot
    estimatedDeliveryMinutes: Number
  },
  orderPlacedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  estimatedDeliveryTime: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    message: String
  }]
}, { 
  timestamps: true 
});

// Index for efficient queries
orderSchema.index({ userId: 1, orderPlacedAt: -1 });
orderSchema.index({ 'deliveryInfo.warehouse.warehouseId': 1 });
orderSchema.index({ 'deliveryInfo.hotspot.hotspotId': 1 });

module.exports = mongoose.model('Order', orderSchema);