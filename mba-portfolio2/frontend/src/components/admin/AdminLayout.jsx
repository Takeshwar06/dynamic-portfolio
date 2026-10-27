import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, User, Briefcase, FolderKanban, Zap,
  Award, BookOpen, Users, FileText, Palette, MessageSquare,
  LogOut, Menu, X, ChevronRight, ExternalLink,
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/profile', icon: User, label: 'Profile' },
  { to: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { to: '/admin/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/admin/skills', icon: Zap, label: 'Skills' },
  { to: '/admin/certifications', icon: Award, label: 'Certifications' },
  { to: '/admin/blog', icon: BookOpen, label: 'Blog' },
  { to: '/admin/leadership', icon: Users, label: 'Leadership' },
  { to: '/admin/resume', icon: FileText, label: 'Resume' },
  { to: '/admin/theme', icon: Palette, label: 'Theme & Layout' },
  { to: '/admin/contacts', icon: MessageSquare, label: 'Messages' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 800, fontFamily: 'Playfair Display, serif', fontSize: '1rem' }}>
              {admin?.name?.charAt(0) || 'A'}
            </span>
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>{admin?.name || 'Admin'}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>Portfolio Admin</div>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem', overflowY: 'auto' }}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: sidebarOpen ? '0.6rem 0.75rem' : '0.6rem',
              borderRadius: 8, marginBottom: 2,
              background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
              textDecoration: 'none', fontWeight: isActive ? 600 : 400, fontSize: '0.88rem',
              transition: 'all 0.2s', justifyContent: sidebarOpen ? 'flex-start' : 'center',
            })}
            className="hover:bg-white/8 hover:text-white"
            title={!sidebarOpen ? label : ''}
          >
            <Icon size={17} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <a href="/" target="_blank" rel="noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.6rem 0.75rem', borderRadius: 8, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: 4, justifyContent: sidebarOpen ? 'flex-start' : 'center' }}
          className="hover:bg-white/10 hover:text-white transition-colors">
          <ExternalLink size={16} /> {sidebarOpen && 'View Portfolio'}
        </a>
        <button onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.6rem 0.75rem', borderRadius: 8, width: '100%', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}
          className="hover:bg-red-500/20 hover:text-red-300 transition-colors">
          <LogOut size={16} /> {sidebarOpen && 'Sign Out'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col"
        style={{
          width: sidebarOpen ? 230 : 64, flexShrink: 0,
          background: 'var(--color-primary)',
          transition: 'width 0.3s ease',
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
        }}>
        <SidebarContent />
        {/* Collapse toggle */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ position: 'absolute', top: '50%', right: -12, transform: 'translateY(-50%)', width: 24, height: 24, borderRadius: '50%', background: 'var(--color-accent)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronRight size={12} style={{ color: 'var(--color-primary)', transform: sidebarOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileSidebar && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
          <div onClick={() => setMobileSidebar(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <aside style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 230, background: 'var(--color-primary)' }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 0 }} className={`md:ml-${sidebarOpen ? '[230px]' : '[64px]'}`}
        style={{ flex: 1, marginLeft: sidebarOpen ? 230 : 64, transition: 'margin-left 0.3s ease', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '0 1.5rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <button onClick={() => setMobileSidebar(true)} className="md:hidden" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
            <Menu size={20} />
          </button>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            Welcome back, <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{admin?.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: '2rem', maxWidth: '100%' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
