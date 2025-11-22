const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/middleware');

router.use(auth);

router.post('/', async (req, res) => {
  try {
    console.log('\n📦 POST /api/orders - Place Order');
    console.log('User ID:', req.user.id);

    const user = await User.findById(req.user.id).populate('cart.product');
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!user.cart || user.cart.length === 0) {
      console.log('❌ Cart is empty');
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    console.log('✅ Cart has', user.cart.length, 'items');

    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of user.cart) {
      const product = cartItem.product;
      
      if (!product) {
        console.log('❌ Product not found in cart item');
        continue;
      }

      if (product.stock < cartItem.quantity) {
        console.log('❌ Insufficient stock for product:', product.name);
        return res.status(400).json({ 
          msg: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${cartItem.quantity}` 
        });
      }

      const itemTotal = product.price * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        subtotal: itemTotal
      });

      product.stock -= cartItem.quantity;
      await product.save();
      console.log('✅ Updated stock for', product.name, '- New stock:', product.stock);
    }

    const orderId = uuidv4();

    const order = new Order({
      orderId,
      userId: user._id,
      items: orderItems,
      totalAmount,
      status: 'Processing',
      orderPlacedAt: new Date(),
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000),
      statusHistory: [{
        status: 'Processing',
        timestamp: new Date(),
        message: 'Order received and is being processed'
      }]
    });

    await order.save();
    console.log('✅ Order created:', orderId);

    user.cart = [];
    await user.save();
    console.log('✅ Cart cleared');

    setTimeout(async () => {
      try {
        const orderToUpdate = await Order.findOne({ orderId });
        if (orderToUpdate && orderToUpdate.status === 'Processing') {
          orderToUpdate.status = 'Confirmed';
          orderToUpdate.statusHistory.push({
            status: 'Confirmed',
            timestamp: new Date(),
            message: 'Order confirmed and ready for dispatch'
          });
          await orderToUpdate.save();
          console.log('✅ Order status updated to Confirmed:', orderId);
        }
      } catch (err) {
        console.error('Error updating order status:', err);
      }
    }, 5000);

    setTimeout(async () => {
      try {
        const orderToUpdate = await Order.findOne({ orderId });
        if (orderToUpdate && orderToUpdate.status === 'Confirmed') {
          orderToUpdate.status = 'Shipped';
          orderToUpdate.statusHistory.push({
            status: 'Shipped',
            timestamp: new Date(),
            message: 'Order has been picked up by delivery partner'
          });
          await orderToUpdate.save();
          console.log('✅ Order status updated to Shipped:', orderId);
        }
      } catch (err) {
        console.error('Error updating order status:', err);
      }
    }, 15000);

    setTimeout(async () => {
      try {
        const orderToUpdate = await Order.findOne({ orderId });
        if (orderToUpdate && orderToUpdate.status === 'Shipped') {
          orderToUpdate.status = 'Delivered';
          orderToUpdate.deliveredAt = new Date();
          orderToUpdate.statusHistory.push({
            status: 'Delivered',
            timestamp: new Date(),
            message: 'Order delivered successfully'
          });
          await orderToUpdate.save();
          console.log('✅ Order status updated to Delivered:', orderId);
        }
      } catch (err) {
        console.error('Error updating order status:', err);
      }
    }, 25000);

    res.status(201).json({
      msg: 'Order placed successfully',
      order: {
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        items: order.items,
        status: order.status,
        orderPlacedAt: order.orderPlacedAt,
        estimatedDeliveryTime: order.estimatedDeliveryTime
      }
    });

  } catch (err) {
    console.error('❌ Place order error:', err);
    res.status(500).json({ msg: 'Failed to place order', error: err.message });
  }
});

// router.get('/', async (req, res) => {
//   try {
//     console.log('\n📋 GET /api/orders');
//     console.log('User ID:', req.user.id);

//     const orders = await Order.find({ userId: req.user.id })
//       .sort({ orderPlacedAt: -1 })
//       .lean();

//     console.log('✅ Found', orders.length, 'orders');

//     res.json(orders);
//   } catch (err) {
//     console.error('❌ Get orders error:', err);
//     res.status(500).json({ msg: 'Failed to fetch orders', error: err.message });
//   }
// });

// router.get('/:orderId', async (req, res) => {
//   try {
//     const { orderId } = req.params;
    
//     console.log('\n🔍 GET /api/orders/:orderId');
//     console.log('Order ID:', orderId);
//     console.log('User ID:', req.user.id);

//     const order = await Order.findOne({ 
//       orderId,
//       userId: req.user.id 
//     }).lean();

//     if (!order) {
//       console.log('❌ Order not found');
//       return res.status(404).json({ msg: 'Order not found' });
//     }

//     console.log('✅ Order found:', order.status);

//     res.json(order);
//   } catch (err) {
//     console.error('❌ Get order error:', err);
//     res.status(500).json({ msg: 'Failed to fetch order', error: err.message });
//   }
// });


router.get('/', async (req, res) => {
  try {
    console.log('\n📋 GET /api/orders');
    console.log('User ID from token:', req.user.id);
    console.log('User object:', req.user);

    const orders = await Order.find({ userId: req.user.id })
      .sort({ orderPlacedAt: -1 })
      .lean();

    console.log('✅ Found', orders.length, 'orders');
    console.log('Orders data:', JSON.stringify(orders, null, 2));

    res.json(orders);
  } catch (err) {
    console.error('❌ Get orders error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ msg: 'Failed to fetch orders', error: err.message });
  }
});

router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    console.log('\n🔍 GET /api/orders/:orderId');
    console.log('Order ID:', orderId);
    console.log('User ID from token:', req.user.id);

    const order = await Order.findOne({ 
      orderId,
      userId: req.user.id 
    }).lean();

    if (!order) {
      console.log('❌ Order not found');
      console.log('Searching for orderId:', orderId, 'userId:', req.user.id);
      return res.status(404).json({ msg: 'Order not found' });
    }

    console.log('✅ Order found:', order.status);
    console.log('Order details:', JSON.stringify(order, null, 2));

    res.json(order);
  } catch (err) {
    console.error('❌ Get order error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ msg: 'Failed to fetch order', error: err.message });
  }
});


module.exports = router;