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
const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  try {
    const bearer = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;
    const token = req.cookies?.token || bearer;
    if (!token) return res.status(401).json({ msg: 'Unauthorized' });

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const uid = payload.id || payload.userId || payload._id;
    if (!uid) return res.status(401).json({ msg: 'Unauthorized' });
    req.userId = uid;
    req.user = uid;
    next();
  } catch (e) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
};