// Add you middleware code here (for example, for authentication, cors, ... etc)const jwt = require('jsonwebtoken');
// const config = require('config');

// function auth(req, res, next) {
//   const token = req.cookies.token || req.header('x-auth-token');
//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }
//   try {
//     const decoded = jwt.verify(token, config.get('jwtSecret'));
//     req.user = decoded.userId;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// }

// module.exports = auth;
// const jwt = require('jsonwebtoken');

// module.exports = function auth(req, res, next) {
//   try {
//     const bearer = req.headers.authorization?.startsWith('Bearer ')
//       ? req.headers.authorization.split(' ')[1]
//       : null;
//     const token = req.cookies?.token || bearer;
//     if (!token) return res.status(401).json({ msg: 'Unauthorized' });

//     const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
//     const uid = payload.id || payload.userId || payload._id;
//     if (!uid) return res.status(401).json({ msg: 'Unauthorized' });
//     req.userId = uid;
//     req.user = uid;
//     next();
//   } catch (e) {
//     return res.status(401).json({ msg: 'Unauthorized' });
//   }
// };

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