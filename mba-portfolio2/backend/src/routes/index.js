const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const experienceController = require('../controllers/experienceController');
const projectController = require('../controllers/projectController');
const {
  getAllSkills, createSkill, updateSkill, deleteSkill,
  getAllCertifications, createCertification, updateCertification, deleteCertification,
  getAllBlogs, getBlog, createBlog, updateBlog, deleteBlog,
  getAllLeadership, createLeadership, updateLeadership, deleteLeadership,
  getResume, uploadResume, deleteResume,
  getThemeSettings, updateThemeSettings,
  createContact, getAllContacts, markContactRead, deleteContact,
  getDashboardStats,
} = require('../controllers/mainController');

// ─── AUTH ──────────────────────────────────────────────────────────────────────
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', protect, authController.getMe);
router.patch('/auth/change-password', protect, authController.changePassword);

// ─── PROFILE ──────────────────────────────────────────────────────────────────
router.get('/profile', profileController.getProfile);
router.put('/profile', protect, upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 },
]), profileController.upsertProfile);

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────
router.get('/experiences', (req, res, next) => {
  if (req.headers.authorization) {
    return require('../middleware/auth').protect(req, res, next);
  }
  next();
}, experienceController.getAllExperiences);
router.post('/experiences', protect, upload.single('logo'), experienceController.createExperience);
router.put('/experiences/reorder', protect, experienceController.reorderExperiences);
router.put('/experiences/:id', protect, upload.single('logo'), experienceController.updateExperience);
router.delete('/experiences/:id', protect, experienceController.deleteExperience);

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
router.get('/projects', projectController.getAllProjects);
router.get('/projects/:slug', projectController.getProject);
router.post('/projects', protect, upload.fields([{ name: 'coverImage', maxCount: 1 }]), projectController.createProject);
router.put('/projects/:id', protect, upload.fields([{ name: 'coverImage', maxCount: 1 }]), projectController.updateProject);
router.delete('/projects/:id', protect, projectController.deleteProject);

// ─── SKILLS ───────────────────────────────────────────────────────────────────
router.get('/skills', getAllSkills);
router.post('/skills', protect, createSkill);
router.put('/skills/:id', protect, updateSkill);
router.delete('/skills/:id', protect, deleteSkill);

// ─── CERTIFICATIONS ───────────────────────────────────────────────────────────
router.get('/certifications', getAllCertifications);
router.post('/certifications', protect, upload.single('image'), createCertification);
router.put('/certifications/:id', protect, upload.single('image'), updateCertification);
router.delete('/certifications/:id', protect, deleteCertification);

// ─── BLOG ─────────────────────────────────────────────────────────────────────
router.get('/blogs', getAllBlogs);
router.get('/blogs/:slug', getBlog);
router.post('/blogs', protect, upload.single('coverImage'), createBlog);
router.put('/blogs/:id', protect, upload.single('coverImage'), updateBlog);
router.delete('/blogs/:id', protect, deleteBlog);

// ─── LEADERSHIP ───────────────────────────────────────────────────────────────
router.get('/leadership', getAllLeadership);
router.post('/leadership', protect, upload.single('image'), createLeadership);
router.put('/leadership/:id', protect, upload.single('image'), updateLeadership);
router.delete('/leadership/:id', protect, deleteLeadership);

// ─── RESUME ───────────────────────────────────────────────────────────────────
router.get('/resume', getResume);
router.post('/resume', protect, upload.single('file'), uploadResume);
router.delete('/resume/:id', protect, deleteResume);

// ─── THEME SETTINGS ───────────────────────────────────────────────────────────
router.get('/theme', getThemeSettings);
router.put('/theme', protect, updateThemeSettings);

// ─── CONTACT ──────────────────────────────────────────────────────────────────
router.post('/contact', createContact);
router.get('/contact', protect, getAllContacts);
router.patch('/contact/:id/read', protect, markContactRead);
router.delete('/contact/:id', protect, deleteContact);

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
router.get('/dashboard/stats', protect, getDashboardStats);

module.exports = router;
