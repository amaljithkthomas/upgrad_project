

const jwt = require('jsonwebtoken');
const config = require('config');

const auth = (req, res, next) => {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('🔐 AUTH MIDDLEWARE');
    console.log('='.repeat(60));
    console.log('URL:', req.originalUrl);
    console.log('Method:', req.method);
    console.log('Headers cookie:', req.headers.cookie);
    console.log('req.cookies:', req.cookies);

    // Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      console.log('❌ NO TOKEN FOUND');
      console.log('Available cookies:', Object.keys(req.cookies || {}));
      console.log('='.repeat(60) + '\n');
      return res.status(401).json({ 
        msg: 'No token, authorization denied',
        authenticated: false
      });
    }

    console.log('✅ Token found (first 50 chars):', token.substring(0, 50) + '...');

    // Verify token
    const secret = process.env.JWT_SECRET || config.get('jwtSecret');
    console.log('Using secret from:', process.env.JWT_SECRET ? 'ENV' : 'CONFIG');
    
    const decoded = jwt.verify(token, secret);
    
    console.log('✅ TOKEN VALID');
    console.log('Decoded:', JSON.stringify(decoded, null, 2));

    // Attach user to request
    req.user = decoded;
    
    console.log('✅ User attached to req.user');
    console.log('User ID:', req.user.id);
    console.log('='.repeat(60) + '\n');
    
    next();
  } catch (err) {
    console.error('❌ AUTH ERROR:', err.name, '-', err.message);
    console.log('='.repeat(60) + '\n');
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token' });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired' });
    }
    
    return res.status(401).json({ msg: 'Token verification failed' });
  }
};

module.exports = auth;