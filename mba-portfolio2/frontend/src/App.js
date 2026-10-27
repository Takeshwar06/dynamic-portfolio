import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTheme } from './redux/slices/themeSlice';
import { fetchMe } from './redux/slices/authSlice';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ExperiencePage from './pages/public/ExperiencePage';
import ProjectsPage from './pages/public/ProjectsPage';
import ProjectDetailPage from './pages/public/ProjectDetailPage';
import SkillsPage from './pages/public/SkillsPage';
import CertificationsPage from './pages/public/CertificationsPage';
import LeadershipPage from './pages/public/LeadershipPage';
import BlogPage from './pages/public/BlogPage';
import BlogDetailPage from './pages/public/BlogDetailPage';
import ContactPage from './pages/public/ContactPage';
import ResumePage from './pages/public/ResumePage';
import PublicLayout from './components/public/PublicLayout';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProfile from './pages/admin/AdminProfile';
import AdminExperience from './pages/admin/AdminExperience';
import AdminProjects from './pages/admin/AdminProjects';
import AdminSkills from './pages/admin/AdminSkills';
import AdminCertifications from './pages/admin/AdminCertifications';
import AdminBlog from './pages/admin/AdminBlog';
import AdminLeadership from './pages/admin/AdminLeadership';
import AdminResume from './pages/admin/AdminResume';
import AdminTheme from './pages/admin/AdminTheme';
import AdminContacts from './pages/admin/AdminContacts';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

function AppContent() {
  const dispatch = useDispatch();
  const { activeTheme } = useSelector((state) => state.theme);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTheme());
  }, [dispatch]);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, [token, dispatch]);

  // Apply theme class to body
  useEffect(() => {
    document.body.className = '';
    if (activeTheme === 'dark') document.body.classList.add('theme-dark');
    else if (activeTheme === 'corporate-blue') document.body.classList.add('theme-corporate-blue');
  }, [activeTheme]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-md)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.9rem',
          },
          success: { iconTheme: { primary: '#059669', secondary: '#fff' } },
          error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="experience" element={<ExperiencePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:slug" element={<ProjectDetailPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="certifications" element={<CertificationsPage />} />
          <Route path="leadership" element={<LeadershipPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogDetailPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="resume" element={<ResumePage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="certifications" element={<AdminCertifications />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="leadership" element={<AdminLeadership />} />
          <Route path="resume" element={<AdminResume />} />
          <Route path="theme" element={<AdminTheme />} />
          <Route path="contacts" element={<AdminContacts />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
