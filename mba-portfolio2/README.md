# MBA Portfolio — Full-Stack MERN Application

A **production-ready, dynamic portfolio website** built for MBA students and professionals. Features a public-facing portfolio with dynamic content and a private admin panel for full content management.

---

## 🏗 Project Structure

```
mba-portfolio/
├── backend/                  # Express.js REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── cloudinary.js         # Cloudinary config
│   │   ├── controllers/
│   │   │   ├── authController.js     # JWT auth (register/login)
│   │   │   ├── profileController.js  # Profile CRUD
│   │   │   ├── experienceController.js
│   │   │   ├── projectController.js  # Case studies CRUD
│   │   │   └── mainController.js     # Skills, Blog, Resume, Theme, Contact
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT protect middleware
│   │   │   ├── errorHandler.js       # Global error handler
│   │   │   └── upload.js             # Multer + Cloudinary upload
│   │   ├── models/
│   │   │   └── index.js              # All Mongoose models
│   │   ├── routes/
│   │   │   └── index.js              # All API routes
│   │   ├── utils/
│   │   │   ├── AppError.js           # Custom error class
│   │   │   ├── helpers.js            # catchAsync, sendResponse, generateSlug
│   │   │   └── seed.js               # Database seeder
│   │   └── server.js                 # Entry point
│   ├── .env
│   └── package.json
│
└── frontend/                 # React.js SPA
    ├── src/
    │   ├── components/
    │   │   ├── admin/
    │   │   │   ├── AdminLayout.jsx   # Sidebar layout for admin
    │   │   │   └── AdminComponents.jsx # Reusable admin UI components
    │   │   ├── public/
    │   │   │   ├── Navbar.jsx        # Responsive public navbar
    │   │   │   ├── Footer.jsx
    │   │   │   └── PublicLayout.jsx
    │   │   └── shared/
    │   │       ├── SectionHeader.jsx
    │   │       └── Skeleton.jsx      # Loading skeletons
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminLogin.jsx
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── AdminProfile.jsx
    │   │   │   ├── AdminExperience.jsx
    │   │   │   ├── AdminProjects.jsx
    │   │   │   ├── AdminSkills.jsx
    │   │   │   ├── AdminCertifications.jsx
    │   │   │   ├── AdminBlog.jsx
    │   │   │   ├── AdminLeadership.jsx
    │   │   │   ├── AdminResume.jsx
    │   │   │   ├── AdminTheme.jsx
    │   │   │   └── AdminContacts.jsx
    │   │   └── public/
    │   │       ├── HomePage.jsx      # Hero + featured projects + CTA
    │   │       ├── AboutPage.jsx
    │   │       ├── ExperiencePage.jsx  # Timeline view
    │   │       ├── ProjectsPage.jsx    # Case study cards with filters
    │   │       ├── ProjectDetailPage.jsx # Full case study view
    │   │       ├── SkillsPage.jsx      # Skill bars by category
    │   │       ├── CertificationsPage.jsx
    │   │       ├── LeadershipPage.jsx
    │   │       ├── BlogPage.jsx        # Listing with tag filter
    │   │       ├── BlogDetailPage.jsx
    │   │       ├── ContactPage.jsx     # Contact form
    │   │       └── ResumePage.jsx      # PDF viewer + download
    │   ├── redux/
    │   │   ├── slices/
    │   │   │   ├── authSlice.js
    │   │   │   └── themeSlice.js
    │   │   └── store/index.js
    │   ├── utils/
    │   │   └── api.js                  # Axios instance with interceptors
    │   ├── App.js
    │   ├── index.js
    │   └── index.css                   # Theme CSS variables + utilities
    ├── .env
    ├── package.json
    └── tailwind.config.js
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn
- MongoDB Atlas account (already configured)
- Cloudinary account (already configured)

---

### 1. Backend Setup

```bash
cd mba-portfolio/backend
npm install
```

Verify the `.env` file has correct values:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://takeshwarverma124_db_user:mm2A8REGsfQRYZdy@cluster0.1f37tuc.mongodb.net/mba_portfolio
JWT_SECRET=mba_portfolio_jwt_super_secret_key_2024_change_in_production
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=do3fiil0d
CLOUDINARY_API_KEY=279377118955315
CLOUDINARY_API_SECRET=2VuDh5pMfBlxqunre38Qj_KxrNY
FRONTEND_URL=http://localhost:3000
```

**Seed the database with sample data:**
```bash
npm run seed
```

This creates:
- Admin user: `admin@portfolio.com` / `Admin@123`
- Sample profile (Rajiv Mehta, MBA candidate)
- 2 professional experiences (McKinsey & Co, Deloitte)
- 2 MBA case study projects
- 4 skill categories with progress levels
- 3 certifications
- 2 leadership activities
- 2 blog posts
- Theme settings

**Start the backend:**
```bash
npm run dev     # Development (with nodemon)
npm start       # Production
```

Backend runs on: `http://localhost:5000`
Health check: `http://localhost:5000/health`

---

### 2. Frontend Setup

```bash
cd mba-portfolio/frontend
npm install
```

Verify `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=MBA Portfolio
```

**Start the frontend:**
```bash
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🔐 Admin Panel

Access: `http://localhost:3000/admin/login`

**Default credentials:**
```
Email:    admin@portfolio.com
Password: Admin@123
```

⚠️ **Change these immediately in production!**

### Admin Panel Features:
| Section | Features |
|---|---|
| **Dashboard** | Stats overview, quick actions |
| **Profile** | Name, bio, avatar, social links, education |
| **Experience** | Add/edit/delete jobs with metrics and achievements |
| **Case Studies** | Full MBA-style case studies (Problem → Analysis → Strategy → Results) |
| **Skills** | Skill categories with proficiency bars |
| **Certifications** | Credentials with verify links |
| **Blog** | Rich text articles with publish/draft toggle |
| **Leadership** | Club roles, activities, achievements |
| **Resume** | PDF upload with browser preview |
| **Theme & Layout** | Switch between Light / Dark / Corporate Blue themes |
| **Messages** | View and reply to contact form submissions |

---

## 🌐 Public Portfolio Pages

| Route | Page |
|---|---|
| `/` | Hero, featured case studies, CTA |
| `/about` | Full bio, contact info, education |
| `/experience` | Professional timeline |
| `/projects` | Case study listing with category filter |
| `/projects/:slug` | Full case study (Problem/Analysis/Strategy/Results) |
| `/skills` | Skills by category with progress bars |
| `/certifications` | Credential cards |
| `/leadership` | Leadership & activities |
| `/blog` | Blog articles with tag filter |
| `/blog/:slug` | Full blog article |
| `/contact` | Contact form |
| `/resume` | PDF viewer + download button |

---

## 📡 REST API Reference

### Authentication
```
POST   /api/auth/register      Create admin account (first-time only)
POST   /api/auth/login         Login → returns JWT token
GET    /api/auth/me            Get current admin (🔒 Protected)
PATCH  /api/auth/change-password   Change password (🔒 Protected)
```

### Profile
```
GET    /api/profile            Get public profile
PUT    /api/profile            Update profile with image uploads (🔒 Protected)
```

### Experience
```
GET    /api/experiences              Get all (public)
POST   /api/experiences              Create (🔒 Protected)
PUT    /api/experiences/reorder      Reorder drag-drop (🔒 Protected)
PUT    /api/experiences/:id          Update (🔒 Protected)
DELETE /api/experiences/:id          Delete (🔒 Protected)
```

### Projects (Case Studies)
```
GET    /api/projects           Get all visible projects
GET    /api/projects/:slug     Get one by slug
POST   /api/projects           Create (🔒 Protected)
PUT    /api/projects/:id       Update (🔒 Protected)
DELETE /api/projects/:id       Delete (🔒 Protected)
```

### Skills
```
GET    /api/skills             Get all skill categories
POST   /api/skills             Create category (🔒 Protected)
PUT    /api/skills/:id         Update (🔒 Protected)
DELETE /api/skills/:id         Delete (🔒 Protected)
```

### Certifications
```
GET    /api/certifications     Get all
POST   /api/certifications     Create (🔒 Protected)
PUT    /api/certifications/:id Update (🔒 Protected)
DELETE /api/certifications/:id Delete (🔒 Protected)
```

### Blog
```
GET    /api/blogs              Get all published posts
GET    /api/blogs/:slug        Get one (increments views)
POST   /api/blogs              Create (🔒 Protected)
PUT    /api/blogs/:id          Update (🔒 Protected)
DELETE /api/blogs/:id          Delete (🔒 Protected)
```

### Leadership
```
GET    /api/leadership         Get all
POST   /api/leadership         Create (🔒 Protected)
PUT    /api/leadership/:id     Update (🔒 Protected)
DELETE /api/leadership/:id     Delete (🔒 Protected)
```

### Resume
```
GET    /api/resume             Get active resume
POST   /api/resume             Upload PDF (🔒 Protected)
DELETE /api/resume/:id         Delete (🔒 Protected)
```

### Theme Settings
```
GET    /api/theme              Get theme/layout settings
PUT    /api/theme              Update settings (🔒 Protected)
```

### Contact
```
POST   /api/contact            Submit contact form (public)
GET    /api/contact            Get all messages (🔒 Protected)
PATCH  /api/contact/:id/read   Mark as read (🔒 Protected)
DELETE /api/contact/:id        Delete message (🔒 Protected)
```

### Dashboard
```
GET    /api/dashboard/stats    Get content statistics (🔒 Protected)
```

---

## 🎨 Themes

The portfolio supports three themes, switchable from the admin panel:

| Theme | Description |
|---|---|
| **Light** (default) | Clean white, navy primary, gold accent |
| **Dark** | Deep navy background, blue primary, gold accent |
| **Corporate Blue** | Light blue-grey background, deep navy text |

Themes use **CSS custom properties** — switching updates the entire UI instantly via body class.

---

## ☁️ Cloudinary File Organization

```
portfolio/
├── images/          # Profile photos, logos, cover images
└── pdfs/            # Resume PDFs
```

- Images: Auto-optimized (format + quality: auto)
- PDFs: Stored as `raw` resource type
- Size limits: Images 2MB, PDFs 5MB

---

## 🔒 Security Features

- JWT authentication with 7-day expiry
- Rate limiting: 200 req/15min general, 10 req/15min for auth
- Helmet.js security headers
- CORS configured for frontend origin
- Input validation (server-side)
- File type and size validation
- Only one admin account allowed
- Centralized error handling (no stack traces in production)

---

## 🗄 MongoDB Collections

| Collection | Purpose |
|---|---|
| `admins` | Single admin user record |
| `profiles` | Personal info, bio, social links |
| `experiences` | Work history with metrics |
| `projects` | MBA case studies |
| `skills` | Skill categories with proficiency |
| `certifications` | Professional credentials |
| `blogs` | Business insight articles |
| `leaderships` | Club roles & activities |
| `resumes` | PDF resume files |
| `themesettings` | Active theme & layout |
| `contacts` | Contact form messages |

---

## 🚀 Production Deployment

### Backend (e.g. Railway, Render, DigitalOcean)
```bash
# Set environment variables in your hosting dashboard
NODE_ENV=production
PORT=5000
MONGO_URI=...
JWT_SECRET=<strong-random-secret>
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=https://yourdomain.com
```

### Frontend (e.g. Vercel, Netlify)
```bash
# Build command
npm run build

# Environment variable
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Redux Toolkit, React Router 6, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| File Upload | Multer + Cloudinary |
| Fonts | Playfair Display (headings), DM Sans (body) |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Security | Helmet, CORS, express-rate-limit |

---

## 🎓 MBA-Specific Features

### Case Study Framework
Each project follows a structured consulting case study format:
1. **Problem Statement** — What challenge was being solved?
2. **Analysis & Insights** — Methods, data, frameworks used
3. **Strategy & Approach** — Recommendations made
4. **Results & Impact** — Quantified outcomes with metrics

### Experience Metrics
Each experience entry supports structured metrics:
```json
[
  { "label": "Revenue Impact", "value": "$45 Cr+" },
  { "label": "Projects Led", "value": "8" }
]
```

### Blog / Insights
Business insights articles with category, tags, featured toggle, view counter, and reading time.

---

*Built with ❤️ using the MERN Stack for MBA professionals.*
