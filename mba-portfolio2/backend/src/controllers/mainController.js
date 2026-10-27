const {
  Skill,
  Certification,
  Blog,
  Leadership,
  Resume,
  ThemeSettings,
  Contact,
} = require("../models");
const { catchAsync, sendResponse, generateSlug } = require("../utils/helpers");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../middleware/upload");
const AppError = require("../utils/AppError");

// ─── SKILLS ────────────────────────────────────────────────────────────────────
exports.getAllSkills = catchAsync(async (req, res) => {
  const filter = req.admin ? {} : { isVisible: true };
  const skills = await Skill.find(filter).sort({ order: 1 });
  sendResponse(res, 200, skills, "Skills fetched");
});

exports.createSkill = catchAsync(async (req, res) => {
  const data = { ...req.body };
  if (data.items && typeof data.items === "string")
    data.items = JSON.parse(data.items);
  const skill = await Skill.create(data);
  sendResponse(res, 201, skill, "Skill category created");
});

exports.updateSkill = catchAsync(async (req, res, next) => {
  const data = { ...req.body };
  if (data.items && typeof data.items === "string")
    data.items = JSON.parse(data.items);
  const skill = await Skill.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!skill) return next(new AppError("Skill not found", 404));
  sendResponse(res, 200, skill, "Skill updated");
});

exports.deleteSkill = catchAsync(async (req, res, next) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) return next(new AppError("Skill not found", 404));
  sendResponse(res, 200, null, "Skill deleted");
});

// ─── CERTIFICATIONS ────────────────────────────────────────────────────────────
exports.getAllCertifications = catchAsync(async (req, res) => {
  const filter = req.admin ? {} : { isVisible: true };
  const certs = await Certification.find(filter).sort({
    order: 1,
    issueDate: -1,
  });
  sendResponse(res, 200, certs, "Certifications fetched");
});

exports.createCertification = catchAsync(async (req, res, next) => {
  const data = { ...req.body };
  if (req.file) {
    if (req.file.size > 2 * 1024 * 1024)
      return next(new AppError("Image must be less than 2MB", 400));
    data.image = await uploadToCloudinary(req.file.buffer, "images");
  }
  const cert = await Certification.create(data);
  sendResponse(res, 201, cert, "Certification created");
});

exports.updateCertification = catchAsync(async (req, res, next) => {
  const existing = await Certification.findById(req.params.id);
  if (!existing) return next(new AppError("Certification not found", 404));
  const data = { ...req.body };
  if (req.file) {
    if (req.file.size > 2 * 1024 * 1024)
      return next(new AppError("Image must be less than 2MB", 400));
    if (existing.image?.publicId)
      await deleteFromCloudinary(existing.image.publicId);
    data.image = await uploadToCloudinary(req.file.buffer, "images");
  }
  const cert = await Certification.findByIdAndUpdate(req.params.id, data, {
    new: true,
  });
  sendResponse(res, 200, cert, "Certification updated");
});

exports.deleteCertification = catchAsync(async (req, res, next) => {
  const cert = await Certification.findById(req.params.id);
  if (!cert) return next(new AppError("Certification not found", 404));
  if (cert.image?.publicId) await deleteFromCloudinary(cert.image.publicId);
  await cert.deleteOne();
  sendResponse(res, 200, null, "Certification deleted");
});

// ─── BLOG ──────────────────────────────────────────────────────────────────────
exports.getAllBlogs = catchAsync(async (req, res) => {
  const filter = req.admin ? {} : { isPublished: true };
  const blogs = await Blog.find(filter).sort({
    publishedAt: -1,
    createdAt: -1,
  });
  sendResponse(res, 200, blogs, "Blogs fetched");
});

exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) return next(new AppError("Blog not found", 404));
  // Increment views
  blog.views += 1;
  await blog.save();
  sendResponse(res, 200, blog, "Blog fetched");
});

exports.createBlog = catchAsync(async (req, res, next) => {
  const data = { ...req.body };
  if (data.tags && typeof data.tags === "string")
    data.tags = JSON.parse(data.tags);
  if (!data.slug) data.slug = generateSlug(data.title);
  const existing = await Blog.findOne({ slug: data.slug });
  if (existing) data.slug = `${data.slug}-${Date.now()}`;
  if (data.isPublished) data.publishedAt = new Date();
  if (req.file) {
    if (req.file.size > 2 * 1024 * 1024)
      return next(new AppError("Image must be less than 2MB", 400));
    data.coverImage = await uploadToCloudinary(req.file.buffer, "images");
  }
  const blog = await Blog.create(data);
  sendResponse(res, 201, blog, "Blog created");
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const existing = await Blog.findById(req.params.id);
  if (!existing) return next(new AppError("Blog not found", 404));
  const data = { ...req.body };
  if (data.tags && typeof data.tags === "string")
    data.tags = JSON.parse(data.tags);
  if (data.isPublished && !existing.publishedAt) data.publishedAt = new Date();
  if (req.file) {
    if (req.file.size > 2 * 1024 * 1024)
      return next(new AppError("Image must be less than 2MB", 400));
    if (existing.coverImage?.publicId)
      await deleteFromCloudinary(existing.coverImage.publicId);
    data.coverImage = await uploadToCloudinary(req.file.buffer, "images");
  }
  const blog = await Blog.findByIdAndUpdate(req.params.id, data, { new: true });
  sendResponse(res, 200, blog, "Blog updated");
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return next(new AppError("Blog not found", 404));
  if (blog.coverImage?.publicId)
    await deleteFromCloudinary(blog.coverImage.publicId);
  await blog.deleteOne();
  sendResponse(res, 200, null, "Blog deleted");
});

// ─── LEADERSHIP ────────────────────────────────────────────────────────────────
exports.getAllLeadership = catchAsync(async (req, res) => {
  const filter = req.admin ? {} : { isVisible: true };
  const items = await Leadership.find(filter).sort({ order: 1, startDate: -1 });
  sendResponse(res, 200, items, "Leadership activities fetched");
});

exports.createLeadership = catchAsync(async (req, res, next) => {
  const data = { ...req.body };
  if (data.achievements && typeof data.achievements === "string")
    data.achievements = JSON.parse(data.achievements);
  if (req.file) {
    if (req.file.size > 2 * 1024 * 1024)
      return next(new AppError("Image must be less than 2MB", 400));
    data.image = await uploadToCloudinary(req.file.buffer, "images");
  }
  const item = await Leadership.create(data);
  sendResponse(res, 201, item, "Leadership activity created");
});

exports.updateLeadership = catchAsync(async (req, res, next) => {
  const existing = await Leadership.findById(req.params.id);
  if (!existing)
    return next(new AppError("Leadership activity not found", 404));
  const data = { ...req.body };
  if (data.achievements && typeof data.achievements === "string")
    data.achievements = JSON.parse(data.achievements);
  if (req.file) {
    if (req.file.size > 2 * 1024 * 1024)
      return next(new AppError("Image must be less than 2MB", 400));
    if (existing.image?.publicId)
      await deleteFromCloudinary(existing.image.publicId);
    data.image = await uploadToCloudinary(req.file.buffer, "images");
  }
  const item = await Leadership.findByIdAndUpdate(req.params.id, data, {
    new: true,
  });
  sendResponse(res, 200, item, "Leadership activity updated");
});

exports.deleteLeadership = catchAsync(async (req, res, next) => {
  const item = await Leadership.findById(req.params.id);
  if (!item) return next(new AppError("Leadership activity not found", 404));
  if (item.image?.publicId) await deleteFromCloudinary(item.image.publicId);
  await item.deleteOne();
  sendResponse(res, 200, null, "Leadership activity deleted");
});

// ─── RESUME ────────────────────────────────────────────────────────────────────
exports.getResume = catchAsync(async (req, res) => {
  const resume = await Resume.findOne({ isActive: true });
  sendResponse(res, 200, resume, "Resume fetched");
});

exports.uploadResume = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError("Please upload a PDF file", 400));
  if (req.file.mimetype !== "application/pdf")
    return next(new AppError("Only PDF files are allowed", 400));
  if (req.file.size > 5 * 1024 * 1024)
    return next(new AppError("Resume must be less than 5MB", 400));

  // Deactivate old resumes
  await Resume.updateMany({}, { isActive: false });

  const fileData = await uploadToCloudinary(req.file.buffer, "pdfs", "raw", {
    format: "pdf",
    resource_type: "raw",
  });
  const resume = await Resume.create({
    title: req.body.title || "Resume",
    file: fileData,
    version: req.body.version || "1.0",
    isActive: true,
  });

  sendResponse(res, 201, resume, "Resume uploaded successfully");
});

exports.deleteResume = catchAsync(async (req, res, next) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) return next(new AppError("Resume not found", 404));
  if (resume.file?.publicId)
    await deleteFromCloudinary(resume.file.publicId, "raw");
  await resume.deleteOne();
  sendResponse(res, 200, null, "Resume deleted");
});

// ─── THEME SETTINGS ────────────────────────────────────────────────────────────
exports.getThemeSettings = catchAsync(async (req, res) => {
  let settings = await ThemeSettings.findOne();
  if (!settings) settings = await ThemeSettings.create({});
  sendResponse(res, 200, settings, "Theme settings fetched");
});

exports.updateThemeSettings = catchAsync(async (req, res) => {
  let settings = await ThemeSettings.findOne();
  if (!settings) {
    settings = await ThemeSettings.create(req.body);
  } else {
    settings = await ThemeSettings.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
    });
  }
  sendResponse(res, 200, settings, "Theme settings updated");
});

// ─── CONTACT ───────────────────────────────────────────────────────────────────
exports.createContact = catchAsync(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    throw new AppError("Name, email, and message are required", 400);
  }
  const contact = await Contact.create({ name, email, subject, message });
  sendResponse(res, 201, contact, "Message sent successfully");
});

exports.getAllContacts = catchAsync(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  sendResponse(res, 200, contacts, "Contacts fetched");
});

exports.markContactRead = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true },
  );
  if (!contact) return next(new AppError("Contact not found", 404));
  sendResponse(res, 200, contact, "Contact marked as read");
});

exports.deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return next(new AppError("Contact not found", 404));
  sendResponse(res, 200, null, "Contact deleted");
});

// ─── DASHBOARD ANALYTICS ───────────────────────────────────────────────────────
exports.getDashboardStats = catchAsync(async (req, res) => {
  const {
    Experience,
    Project,
    Blog,
    Contact,
    Certification,
  } = require("../models");

  const [
    experiences,
    projects,
    blogs,
    contacts,
    certifications,
    unreadContacts,
  ] = await Promise.all([
    Experience.countDocuments(),
    Project.countDocuments(),
    Blog.countDocuments({ isPublished: true }),
    Contact.countDocuments(),
    Certification.countDocuments(),
    Contact.countDocuments({ isRead: false }),
  ]);

  sendResponse(
    res,
    200,
    {
      experiences,
      projects,
      blogs,
      contacts,
      certifications,
      unreadContacts,
    },
    "Dashboard stats fetched",
  );
});
