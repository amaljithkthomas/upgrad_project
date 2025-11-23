const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');
const Hotspot = require('../models/Hotspot');
const auth = require('../middleware/middleware');
const { findNearest, calculateEstimatedDeliveryTime } = require('../utils/distanceCalculator');

router.use(auth);

// POST /api/orders - Place an order with warehouse and hotspot assignment
router.post('/', async (req, res) => {
  try {
    console.log('\n📦 POST /api/orders - Place Order');
    console.log('User ID:', req.user.id);
    
    // NEW: Get user location from request body
    const { latitude, longitude, address } = req.body;

    if (!req.user || !req.user.id) {
      console.log('❌ No user ID in token');
      return res.status(401).json({ msg: 'Authentication required' });
    }

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

    // NEW: Determine user location
    let userLocation;
    if (latitude && longitude) {
      // Use location from request
      userLocation = { latitude, longitude, address };
      console.log('📍 Using location from request:', userLocation);
    } else if (user.location && user.location.latitude && user.location.longitude) {
      // Use saved user location
      userLocation = {
        latitude: user.location.latitude,
        longitude: user.location.longitude,
        address: user.location.address
      };
      console.log('📍 Using saved user location:', userLocation);
    } else {
      console.log('❌ No user location available');
      return res.status(400).json({ 
        msg: 'User location required. Please provide latitude and longitude or update your profile.' 
      });
    }

    let totalAmount = 0;
    const orderItems = [];
    const outOfStockItems = [];

    for (const cartItem of user.cart) {
      const product = cartItem.product;
      
      if (!product) {
        console.log('❌ Product not found in cart item');
        continue;
      }

      if (product.stock < cartItem.quantity) {
        console.log('❌ Insufficient stock for product:', product.name);
        outOfStockItems.push({
          name: product.name,
          available: product.stock,
          requested: cartItem.quantity
        });
        continue;
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

    if (outOfStockItems.length > 0) {
      console.log('❌ Some items are out of stock:', outOfStockItems);
      return res.status(400).json({ 
        msg: 'Some items are out of stock',
        outOfStockItems
      });
    }

    if (orderItems.length === 0) {
      console.log('❌ No valid items to order');
      return res.status(400).json({ msg: 'No valid items to order' });
    }

    // NEW: Find nearest warehouse
    console.log('\n🏭 Finding nearest warehouse...');
    const warehouses = await Warehouse.find({ isActive: true }).lean();
    
    if (warehouses.length === 0) {
      console.log('❌ No active warehouses available');
      return res.status(503).json({ msg: 'No warehouses available for delivery' });
    }
    
    const nearestWarehouse = findNearest(userLocation, warehouses);
    console.log('✅ Nearest warehouse:', nearestWarehouse.name);
    console.log('Distance:', nearestWarehouse.distance, 'km');

    // NEW: Find nearest hotspot
    console.log('\n📍 Finding nearest hotspot...');
    const hotspots = await Hotspot.find({ isActive: true }).lean();
    
    if (hotspots.length === 0) {
      console.log('❌ No active hotspots available');
      return res.status(503).json({ msg: 'No delivery hotspots available' });
    }
    
    const nearestHotspot = findNearest(userLocation, hotspots);
    console.log('✅ Nearest hotspot:', nearestHotspot.name);
    console.log('Distance:', nearestHotspot.distance, 'km');

    // NEW: Calculate total distance and estimated delivery time
    const totalDistance = nearestWarehouse.distance + nearestHotspot.distance;
    const estimatedMinutes = calculateEstimatedDeliveryTime(totalDistance);
    
    console.log('\n📊 Delivery Estimation:');
    console.log('Total distance:', totalDistance.toFixed(2), 'km');
    console.log('Estimated delivery time:', estimatedMinutes, 'minutes');

    const orderId = uuidv4();
    const estimatedDeliveryTime = new Date(Date.now() + estimatedMinutes * 60 * 1000);

    // NEW: Create order with warehouse and hotspot info
    const order = new Order({
      orderId,
      userId: user._id,
      items: orderItems,
      totalAmount,
      status: 'Processing',
      deliveryInfo: {
        warehouse: {
          warehouseId: nearestWarehouse.warehouseId,
          name: nearestWarehouse.name,
          location: nearestWarehouse.location,
          distance: nearestWarehouse.distance
        },
        hotspot: {
          hotspotId: nearestHotspot.hotspotId,
          name: nearestHotspot.name,
          location: nearestHotspot.location,
          distance: nearestHotspot.distance
        },
        userLocation: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          address: userLocation.address || 'Not provided'
        },
        totalDistance,
        estimatedDeliveryMinutes: estimatedMinutes
      },
      orderPlacedAt: new Date(),
      estimatedDeliveryTime,
      statusHistory: [{
        status: 'Processing',
        timestamp: new Date(),
        message: `Order received and assigned to ${nearestWarehouse.name}`
      }]
    });

    await order.save();
    console.log('✅ Order created:', orderId);

    // Update warehouse order count
    await Warehouse.updateOne(
      { warehouseId: nearestWarehouse.warehouseId },
      { $inc: { currentOrders: 1 } }
    );

    // Update hotspot delivery count
    await Hotspot.updateOne(
      { hotspotId: nearestHotspot.hotspotId },
      { $inc: { activeDeliveries: 1 } }
    );

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
            message: `Order confirmed at ${nearestWarehouse.name} and ready for dispatch`
          });
          await orderToUpdate.save();
          console.log('✅ Order status updated to Confirmed:', orderId);
        }
      } catch (err) {
        console.error('❌ Error updating order to Confirmed:', err);
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
            message: `Order dispatched from ${nearestWarehouse.name} via ${nearestHotspot.name}`
          });
          await orderToUpdate.save();
          console.log('✅ Order status updated to Shipped:', orderId);
        }
      } catch (err) {
        console.error('❌ Error updating order to Shipped:', err);
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
          
          // Decrement warehouse and hotspot counters
          await Warehouse.updateOne(
            { warehouseId: nearestWarehouse.warehouseId },
            { $inc: { currentOrders: -1 } }
          );
          await Hotspot.updateOne(
            { hotspotId: nearestHotspot.hotspotId },
            { $inc: { activeDeliveries: -1 } }
          );
          
          console.log('✅ Order status updated to Delivered:', orderId);
        }
      } catch (err) {
        console.error('❌ Error updating order to Delivered:', err);
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
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        deliveryInfo: order.deliveryInfo
      }
    });

  } catch (err) {
    console.error('❌ Place order error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      msg: 'Failed to place order', 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});


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