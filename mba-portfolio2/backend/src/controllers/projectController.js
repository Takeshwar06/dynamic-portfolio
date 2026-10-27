const { Project } = require('../models');
const { catchAsync, sendResponse, generateSlug } = require('../utils/helpers');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');
const AppError = require('../utils/AppError');

exports.getAllProjects = catchAsync(async (req, res) => {
  const filter = req.admin ? {} : { isVisible: true };
  const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
  sendResponse(res, 200, projects, 'Projects fetched');
});

exports.getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) return next(new AppError('Project not found', 404));
  sendResponse(res, 200, project, 'Project fetched');
});

exports.createProject = catchAsync(async (req, res, next) => {
  const data = { ...req.body };

  // Parse JSON fields
  ['metrics', 'tools', 'frameworks', 'tags'].forEach((field) => {
    if (data[field] && typeof data[field] === 'string') {
      try { data[field] = JSON.parse(data[field]); } catch {}
    }
  });

  // Generate slug
  if (!data.slug) data.slug = generateSlug(data.title);

  // Check slug uniqueness
  const existingSlug = await Project.findOne({ slug: data.slug });
  if (existingSlug) data.slug = `${data.slug}-${Date.now()}`;

  // Cover image
  if (req.files?.coverImage) {
    const file = req.files.coverImage[0];
    if (file.size > 2 * 1024 * 1024) return next(new AppError('Cover image must be less than 2MB', 400));
    data.coverImage = await uploadToCloudinary(file.buffer, 'images');
  }

  const project = await Project.create(data);
  sendResponse(res, 201, project, 'Project created');
});

exports.updateProject = catchAsync(async (req, res, next) => {
  const existing = await Project.findById(req.params.id);
  if (!existing) return next(new AppError('Project not found', 404));

  const data = { ...req.body };
  ['metrics', 'tools', 'frameworks', 'tags'].forEach((field) => {
    if (data[field] && typeof data[field] === 'string') {
      try { data[field] = JSON.parse(data[field]); } catch {}
    }
  });

  if (req.files?.coverImage) {
    const file = req.files.coverImage[0];
    if (file.size > 2 * 1024 * 1024) return next(new AppError('Cover image must be less than 2MB', 400));
    if (existing.coverImage?.publicId) await deleteFromCloudinary(existing.coverImage.publicId);
    data.coverImage = await uploadToCloudinary(file.buffer, 'images');
  }

  const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  sendResponse(res, 200, project, 'Project updated');
});

exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) return next(new AppError('Project not found', 404));
  if (project.coverImage?.publicId) await deleteFromCloudinary(project.coverImage.publicId);
  await project.deleteOne();
  sendResponse(res, 200, null, 'Project deleted');
});
