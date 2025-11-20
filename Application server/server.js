// Add your functions for database connection and configuring middleware, defining API endpoints, and starting the server.

const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const authMiddleware = require('./middleware/middleware');
const authRoutes = require('./routes/auth');

const app = express();

const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();
const User = require('./models/User');

// app.use(cors()); 
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); 


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);


// Protected route example
app.get('/api/auth/protected', authMiddleware, (req, res) => {
  res.json({ ok: true, userId: req.userId });
});


app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ msg: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));