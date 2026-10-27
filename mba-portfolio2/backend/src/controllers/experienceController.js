const { Experience } = require('../models');
const { catchAsync, sendResponse } = require('../utils/helpers');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');
const AppError = require('../utils/AppError');

exports.getAllExperiences = catchAsync(async (req, res) => {
  const filter = req.admin ? {} : { isVisible: true };
  const experiences = await Experience.find(filter).sort({ order: 1, startDate: -1 });
  sendResponse(res, 200, experiences, 'Experiences fetched');
});

exports.createExperience = catchAsync(async (req, res, next) => {
  const data = { ...req.body };
  if (data.achievements && typeof data.achievements === 'string') {
    data.achievements = JSON.parse(data.achievements);
  }
  if (data.metrics && typeof data.metrics === 'string') {
    data.metrics = JSON.parse(data.metrics);
  }

  if (req.file) {
    if (req.file.size > 2 * 1024 * 1024) return next(new AppError('Logo must be less than 2MB', 400));
    data.logo = await uploadToCloudinary(req.file.buffer, 'images');
  }

  const experience = await Experience.create(data);
  sendResponse(res, 201, experience, 'Experience created');
});

exports.updateExperience = catchAsync(async (req, res, next) => {
  const data = { ...req.body };
  if (data.achievements && typeof data.achievements === 'string') {
    data.achievements = JSON.parse(data.achievements);
  }
  if (data.metrics && typeof data.metrics === 'string') {
    data.metrics = JSON.parse(data.metrics);
  }

  const existing = await Experience.findById(req.params.id);
  if (!existing) return next(new AppError('Experience not found', 404));

  if (req.file) {
    if (req.file.size > 2 * 1024 * 1024) return next(new AppError('Logo must be less than 2MB', 400));
    if (existing.logo?.publicId) await deleteFromCloudinary(existing.logo.publicId);
    data.logo = await uploadToCloudinary(req.file.buffer, 'images');
  }

  const experience = await Experience.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  sendResponse(res, 200, experience, 'Experience updated');
});

exports.deleteExperience = catchAsync(async (req, res, next) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) return next(new AppError('Experience not found', 404));
  if (experience.logo?.publicId) await deleteFromCloudinary(experience.logo.publicId);
  await experience.deleteOne();
  sendResponse(res, 200, null, 'Experience deleted');
});

exports.reorderExperiences = catchAsync(async (req, res) => {
  const { orderedIds } = req.body;
  const updates = orderedIds.map((id, index) =>
    Experience.findByIdAndUpdate(id, { order: index })
  );
  await Promise.all(updates);
  sendResponse(res, 200, null, 'Experiences reordered');
});
