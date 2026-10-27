const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const AppError = require('../utils/AppError');
const { catchAsync, sendResponse } = require('../utils/helpers');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Only allow one admin
  const existingAdmin = await Admin.findOne();
  if (existingAdmin) {
    return next(new AppError('Admin account already exists.', 400));
  }

  const admin = await Admin.create({ name, email, password });
  const token = signToken(admin._id);

  sendResponse(res, 201, { token, admin: { id: admin._id, name: admin.name, email: admin.email } }, 'Admin registered successfully');
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.correctPassword(password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  const token = signToken(admin._id);
  sendResponse(res, 200, { token, admin: { id: admin._id, name: admin.name, email: admin.email } }, 'Logged in successfully');
});

exports.getMe = catchAsync(async (req, res, next) => {
  sendResponse(res, 200, req.admin, 'Admin profile fetched');
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin._id).select('+password');

  if (!(await admin.correctPassword(currentPassword))) {
    return next(new AppError('Current password is incorrect.', 400));
  }

  admin.password = newPassword;
  await admin.save();

  const token = signToken(admin._id);
  sendResponse(res, 200, { token }, 'Password changed successfully');
});
