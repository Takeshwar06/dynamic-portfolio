const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── Admin User Model ──────────────────────────────────────────────────────────
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ─── Profile Model ─────────────────────────────────────────────────────────────
const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  tagline: { type: String, trim: true },
  bio: { type: String },
  shortBio: { type: String },
  email: { type: String },
  phone: { type: String },
  location: { type: String },
  mbaProgram: { type: String },
  university: { type: String },
  graduationYear: { type: String },
  linkedin: { type: String },
  github: { type: String },
  twitter: { type: String },
  website: { type: String },
  avatar: {
    url: { type: String },
    publicId: { type: String },
  },
  heroImage: {
    url: { type: String },
    publicId: { type: String },
  },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

// ─── Experience Model ──────────────────────────────────────────────────────────
const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'], default: 'Full-time' },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
  description: { type: String },
  achievements: [{ type: String }],
  metrics: [{ label: String, value: String }],
  skills: [{ type: String }],
  logo: { url: String, publicId: String },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

// ─── Project (Case Study) Model ────────────────────────────────────────────────
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  tagline: { type: String },
  category: { type: String },
  industry: { type: String },
  duration: { type: String },
  teamSize: { type: String },
  role: { type: String },
  // Case Study Structure
  problem: { type: String },
  analysis: { type: String },
  strategy: { type: String },
  result: { type: String },
  // Metrics
  metrics: [{ label: String, value: String, icon: String }],
  // Tools & Tech
  tools: [{ type: String }],
  frameworks: [{ type: String }],
  // Media
  coverImage: { url: String, publicId: String },
  images: [{ url: String, publicId: String, caption: String }],
  // Links
  liveUrl: { type: String },
  caseStudyUrl: { type: String },
  // Visibility
  isFeatured: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  tags: [{ type: String }],
}, { timestamps: true });

// ─── Skills Model ──────────────────────────────────────────────────────────────
const skillSchema = new mongoose.Schema({
  category: { type: String, required: true },
  items: [{
    name: { type: String, required: true },
    level: { type: Number, min: 0, max: 100, default: 80 },
    icon: { type: String },
  }],
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

// ─── Certification Model ───────────────────────────────────────────────────────
const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: Date },
  expiryDate: { type: Date },
  credentialId: { type: String },
  credentialUrl: { type: String },
  description: { type: String },
  image: { url: String, publicId: String },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

// ─── Blog Model ───────────────────────────────────────────────────────────────
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  excerpt: { type: String },
  content: { type: String },
  category: { type: String },
  tags: [{ type: String }],
  coverImage: { url: String, publicId: String },
  readTime: { type: Number, default: 5 },
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  publishedAt: { type: Date },
  views: { type: Number, default: 0 },
}, { timestamps: true });

// ─── Leadership/Activities Model ──────────────────────────────────────────────
const leadershipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  role: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
  description: { type: String },
  achievements: [{ type: String }],
  image: { url: String, publicId: String },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

// ─── Resume Model ─────────────────────────────────────────────────────────────
const resumeSchema = new mongoose.Schema({
  title: { type: String, default: 'Resume' },
  file: { url: String, publicId: String },
  version: { type: String },
  isActive: { type: Boolean, default: true },
  uploadedAt: { type: Date, default: Date.now },
});

// ─── Theme Settings Model ─────────────────────────────────────────────────────
const themeSettingsSchema = new mongoose.Schema({
  activeTheme: { type: String, enum: ['light', 'dark', 'corporate-blue'], default: 'light' },
  activeLayout: { type: String, enum: ['classic', 'modern', 'minimal'], default: 'modern' },
  primaryColor: { type: String, default: '#1a365d' },
  accentColor: { type: String, default: '#d69e2e' },
  fontHeading: { type: String, default: 'Playfair Display' },
  fontBody: { type: String, default: 'Inter' },
  sectionOrder: [{ type: String }],
  sectionVisibility: { type: Map, of: Boolean },
}, { timestamps: true });

// ─── Contact Message Model ────────────────────────────────────────────────────
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = {
  Admin: mongoose.model('Admin', adminSchema),
  Profile: mongoose.model('Profile', profileSchema),
  Experience: mongoose.model('Experience', experienceSchema),
  Project: mongoose.model('Project', projectSchema),
  Skill: mongoose.model('Skill', skillSchema),
  Certification: mongoose.model('Certification', certificationSchema),
  Blog: mongoose.model('Blog', blogSchema),
  Leadership: mongoose.model('Leadership', leadershipSchema),
  Resume: mongoose.model('Resume', resumeSchema),
  ThemeSettings: mongoose.model('ThemeSettings', themeSettingsSchema),
  Contact: mongoose.model('Contact', contactSchema),
};
