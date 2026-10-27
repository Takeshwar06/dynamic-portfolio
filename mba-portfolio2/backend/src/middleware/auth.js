const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    req.admin = admin;
    next();
  } catch (err) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
};

module.exports = { protect };
