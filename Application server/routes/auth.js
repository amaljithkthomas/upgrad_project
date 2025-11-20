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
    
    console.log('Signup attempt:', email);
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    
    if (existing) {
      console.log('User already exists:', normalizedEmail);
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    const user = new User({ 
      email: normalizedEmail, 
      password: hash,
      name: name || email.split('@')[0],
      cart: [] // Initialize empty cart
    });
    
    await user.save();
    console.log('✅ User created:', normalizedEmail);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', email);
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      console.log('User not found:', normalizedEmail);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User found, comparing password...');
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || config.get('jwtSecret'),
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    console.log('✅ Login successful:', normalizedEmail);
    
    res.json({ 
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: false });
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/status
router.get('/status', (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || config.get('jwtSecret'));
    res.json({ authenticated: true, userId: decoded.id });
  } catch (err) {
    res.json({ authenticated: false });
  }
});

// GET /api/auth/protected
router.get('/protected', auth, (req, res) => {
  res.json({ ok: true, userId: req.user });
});

module.exports = router;