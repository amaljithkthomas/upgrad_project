const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   name: {
//     type: String,
//     default: ''
//   },
//   cart: [{
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product'
//     },
//     quantity: {
//       type: Number,
//       default: 1,
//       min: 1
//     }
//   }],
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  // NEW: User Location
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    city: String,
    pincode: String,
    landmark: String
  },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      }
    }
  ]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);