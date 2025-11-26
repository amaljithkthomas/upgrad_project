// Add your functions for database connection and configuring middleware, defining API endpoints, and starting the server.

// const express = require('express');
// const mongoose = require('mongoose');
// const config = require('config');
// const cors = require('cors'); 
// const cookieParser = require('cookie-parser');
// const productRoutes = require('./routes/product');
// const cartRoutes = require('./routes/cart');
// const authMiddleware = require('./middleware/middleware');
// const authRoutes = require('./routes/auth');

// const app = express();

// const db = config.get('mongoURI');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(db, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB Connected...');
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1);
//   }
// };

// connectDB();
// const User = require('./models/User');

// // app.use(cors()); 
// const corsOptions = {
//   origin: 'http://localhost:5173',
//   credentials: true
// };

// app.use(cors(corsOptions));
// app.use(express.json());
// app.use(cookieParser()); 


// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);


// // Protected route example
// app.get('/api/auth/protected', authMiddleware, (req, res) => {
//   res.json({ ok: true, userId: req.userId });
// });


// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err);
//   res.status(500).json({ msg: 'Server error' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

//******************************************** *//

const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// MongoDB Connection
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  }
};

connectDB();

// =========================================
// MIDDLEWARE - ORDER IS CRITICAL!
// =========================================

// 1. CORS - Must be FIRST, before any other middleware
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, // CRITICAL for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
};
app.use(cors(corsOptions));

// 2. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Cookie parser - MUST be before routes
app.use(cookieParser());

// 4. Request logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  console.log('Cookie header:', req.headers.cookie ? 'present' : 'absent');
  console.log('Parsed cookies:', Object.keys(req.cookies || {}).length, 'cookies');
  if (req.cookies && Object.keys(req.cookies).length > 0) {
    console.log('Cookie names:', Object.keys(req.cookies));
  }
  next();
});

// =========================================
// ROUTES
// =========================================

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const warehouseRoutes = require('./routes/warehouse');
const hotspotRoutes = require('./routes/hotspot');
const recommendationsRoutes = require('./routes/recommendations');

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/hotspot', hotspotRoutes);
app.use('/api/recommendations', recommendationsRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    cookieParser: 'active',
    routes: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      warehouse: '/api/warehouse',
      hotspot: '/api/hotspot',
      recommendations: '/api/recommendations'
    }
  });
});

// Data Seeding Endpoint (Development Only)
app.post('/api/seed-data', async (req, res) => {
  try {
    console.log('\n🌱 Seeding database...');
    const { seedAll } = require('./utils/seedData');
    await seedAll();
    res.json({ msg: 'Database seeded successfully' });
  } catch (err) {
    console.error('❌ Seeding error:', err);
    res.status(500).json({ msg: 'Failed to seed database', error: err.message });
  }
});

// =========================================
// ERROR HANDLERS
// =========================================

// 404
app.use((req, res) => {
  console.log('❌ 404 Not Found:', req.method, req.path);
  res.status(404).json({ 
    msg: 'Route not found', 
    path: req.path,
    method: req.method 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err);
  res.status(500).json({ 
    msg: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// =========================================
// START SERVER
// =========================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 upGrad Quick Commerce Backend Server');
  console.log('='.repeat(70));
  console.log(`✅ Server running on port: ${PORT}`);
  console.log(`✅ Frontend URL: http://localhost:5173`);
  console.log(`✅ Backend URL: http://localhost:${PORT}`);
  console.log(`✅ Health Check: http://localhost:${PORT}/health`);
  console.log('\n📋 Available API Routes:');
  console.log('   🔐 /api/auth           - Authentication');
  console.log('   📦 /api/products       - Product Management');
  console.log('   🛒 /api/cart           - Shopping Cart');
  console.log('   📋 /api/orders         - Order Management');
  console.log('   🏭 /api/warehouse      - Warehouse Management');
  console.log('   📍 /api/hotspot        - Delivery Hotspot Management');
  console.log('   📊 /api/recommendations - Product Recommendations');
  console.log('='.repeat(70) + '\n');
});