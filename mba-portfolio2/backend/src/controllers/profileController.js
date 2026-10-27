const { Profile } = require('../models');
const { catchAsync, sendResponse } = require('../utils/helpers');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');
const AppError = require('../utils/AppError');

exports.getProfile = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne();
  sendResponse(res, 200, profile, 'Profile fetched');
});

exports.upsertProfile = catchAsync(async (req, res, next) => {
  let profile = await Profile.findOne();
  const updateData = { ...req.body };

  // Handle avatar upload
  if (req.files?.avatar) {
    const file = req.files.avatar[0];
    if (file.size > 2 * 1024 * 1024) return next(new AppError('Avatar image must be less than 2MB', 400));
    if (profile?.avatar?.publicId) await deleteFromCloudinary(profile.avatar.publicId);
    updateData.avatar = await uploadToCloudinary(file.buffer, 'images');
  }

  // Handle hero image upload
  if (req.files?.heroImage) {
    const file = req.files.heroImage[0];
    if (file.size > 2 * 1024 * 1024) return next(new AppError('Hero image must be less than 2MB', 400));
    if (profile?.heroImage?.publicId) await deleteFromCloudinary(profile.heroImage.publicId);
    updateData.heroImage = await uploadToCloudinary(file.buffer, 'images');
  }

  if (profile) {
    profile = await Profile.findOneAndUpdate({}, updateData, { new: true, runValidators: true });
  } else {
    profile = await Profile.create(updateData);
  }

  sendResponse(res, 200, profile, 'Profile updated successfully');
});
