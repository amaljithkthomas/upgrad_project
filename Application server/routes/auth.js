const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const User = require('../models/User');
const auth = require('../middleware/middleware');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    console.log('\n📝 SIGNUP REQUEST');
    console.log('Email:', email);
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    
    if (existing) {
      console.log('❌ User exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    const user = new User({ 
      email: normalizedEmail, 
      password: hash,
      name: name || email.split('@')[0],
      cart: []
    });
    
    await user.save();
    console.log('✅ User created');

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('\n' + '='.repeat(60));
    console.log('🔐 LOGIN REQUEST');
    console.log('='.repeat(60));
    console.log('Email:', email);
    console.log('Origin:', req.headers.origin);
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ User found');

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('❌ Password incorrect');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Password correct');

    // Create JWT payload
    const payload = {
      id: user._id.toString(),
      email: user.email
    };
    
    const secret = process.env.JWT_SECRET || config.get('jwtSecret');
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });
    
    console.log('✅ JWT Token created');
    console.log('Token (first 50 chars):', token.substring(0, 50) + '...');
    console.log('Payload:', payload);
    console.log('Token expires in: 7 days');

    // CRITICAL: Set cookie with correct options
    const cookieOptions = {
      httpOnly: true,
      secure: false, // false for localhost, true for production HTTPS
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: '/'
    };

    res.cookie('token', token, cookieOptions);
    
    console.log('✅ Cookie set');
    console.log('Cookie name: token');
    console.log('Cookie options:', JSON.stringify(cookieOptions, null, 2));
    console.log('='.repeat(60));
    console.log('✅ LOGIN SUCCESSFUL');
    console.log('='.repeat(60) + '\n');

    // Send response
    res.json({
      message: 'Logged in successfully',
      token, // Also send token in response body for debugging
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  console.log('\n👋 LOGOUT REQUEST');
  
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/'
  });
  
  console.log('✅ Cookie cleared');
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/status
router.get('/status', (req, res) => {
  console.log('\n📊 STATUS CHECK');
  console.log('Cookies:', req.cookies);
  console.log('Has token:', !!req.cookies?.token);
  
  const token = req.cookies?.token;
  
  if (!token) {
    console.log('❌ No token');
    return res.json({ authenticated: false });
  }

  try {
    const secret = process.env.JWT_SECRET || config.get('jwtSecret');
    const decoded = jwt.verify(token, secret);
    
    console.log('✅ User authenticated');
    console.log('User ID:', decoded.id);
    
    res.json({ 
      authenticated: true, 
      userId: decoded.id,
      email: decoded.email
    });
  } catch (err) {
    console.log('❌ Invalid token:', err.message);
    res.json({ authenticated: false });
  }
});

// GET /api/auth/protected (test route)
router.get('/protected', auth, (req, res) => {
  console.log('\n🔒 PROTECTED ROUTE');
  console.log('User:', req.user);
  
  res.json({ 
    ok: true, 
    userId: req.user.id,
    email: req.user.email
  });
});

module.exports = router;