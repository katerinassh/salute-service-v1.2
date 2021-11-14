const jwt = require('jsonwebtoken');
require('dotenv').config();

// eslint-disable-next-line consistent-return
const authenticate = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(403).send('Access denied');

    const decoded = jwt.verify(token, process.env.JWTSECRETKEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};

module.exports = { authenticate };
