import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import API from '../../utils/api';

const NAV_LINKS = [
  { to: '/', label: 'Home', exact: true },
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Case Studies' },
  { to: '/skills', label: 'Skills' },
  { to: '/blog', label: 'Insights' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profile, setProfile] = useState(null);
  const location = useLocation();
  const { activeTheme } = useSelector((state) => state.theme);

  useEffect(() => { setMobileOpen(false); }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    API.get('/profile').then((res) => setProfile(res.data.data)).catch(() => {});
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: scrolled ? 'var(--color-surface)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              style={{ background: 'var(--color-primary)' }}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold font-heading text-lg"
            >
              {profile?.name?.charAt(0) || 'R'}
            </motion.div>
            <div>
              <div style={{ color: 'var(--color-text-primary)' }} className="font-heading font-semibold text-sm leading-tight">
                {profile?.name || 'Rajiv Mehta'}
              </div>
              <div style={{ color: 'var(--color-text-muted)' }} className="text-xs leading-tight">
                {profile?.mbaProgram || 'MBA Candidate'}
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              >
                <NavLink
                  to={link.to}
                  end={link.exact}
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    fontWeight: isActive ? '600' : '500',
                    position: 'relative',
                  })}
                  className="px-3 py-2 rounded-lg text-sm transition-colors hover:text-primary block"
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          style={{ position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, background: 'var(--color-accent)', borderRadius: 2 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden md:flex"
          >
            <Link to="/resume" className="btn-primary text-sm py-2 px-4">
              <Download size={15} /> Resume
            </Link>
          </motion.div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: 'var(--color-text-primary)' }}
            className="md:hidden p-2 rounded-lg"
          >
            <AnimatePresence mode="wait">
              {mobileOpen
                ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X size={22} /></motion.div>
                : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu size={22} /></motion.div>
              }
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', overflow: 'hidden' }}
            className="md:hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <NavLink
                    to={link.to}
                    end={link.exact}
                    style={({ isActive }) => ({
                      color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      background: isActive ? 'var(--color-bg-secondary)' : 'transparent',
                    })}
                    className="block px-4 py-3 rounded-lg text-sm font-medium"
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="pt-2">
                <Link to="/resume" className="btn-primary w-full justify-center text-sm">
                  <Download size={15} /> Resume
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
