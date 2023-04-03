const jwt = require('jsonwebtoken');
const jwtSecret = 'this_is_my_secret';
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log('Token:', token);
    const decodedToken = jwt.verify(token, jwtSecret);
    const user = await User.findById(decodedToken.userId);

    console.log('Decoded Token:', decodedToken); /
    console.log('User:', user); 

    if (!user) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};


module.exports = authMiddleware;

