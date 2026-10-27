import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Github, Twitter, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../utils/api';

const LINKS = [
  { to: '/about', label: 'About Me' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Case Studies' },
  { to: '/skills', label: 'Skills' },
  { to: '/blog', label: 'Insights' },
  { to: '/contact', label: 'Contact' },
  { to: '/resume', label: 'Resume' },
];

export default function Footer() {
  const [profile, setProfile] = useState(null);
  useEffect(() => { API.get('/profile').then((res) => setProfile(res.data.data)).catch(() => {}); }, []);

  return (
    <footer style={{ background: 'var(--color-text-primary)', color: '#e2e8f0' }} className="pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h3 className="font-heading text-xl text-white mb-3">{profile?.name || 'Rajiv Mehta'}</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{profile?.tagline || 'MBA Candidate · Strategy & Operations'}</p>
            <div className="flex gap-3">
              {[
                { href: profile?.linkedin, icon: Linkedin },
                { href: profile?.github, icon: Github },
                { href: profile?.twitter, icon: Twitter },
              ].filter(s => s.href).map(({ href, icon: Icon }, i) => (
                <motion.a key={i} href={href} target="_blank" rel="noreferrer"
                  whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.95 }}
                  style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2e8f0', textDecoration: 'none', transition: 'background 0.2s' }}
                  className="hover:bg-white/20">
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2">
              {LINKS.map((link, i) => (
                <motion.li key={link.to} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link to={link.to} style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-white">{link.label}</Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Get in Touch</h4>
            <div className="space-y-3">
              {profile?.email && <a href={`mailto:${profile.email}`} style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }} className="hover:text-white transition-colors"><Mail size={13} /> {profile.email}</a>}
              {profile?.location && <div style={{ color: '#94a3b8', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={13} /> {profile.location}</div>}
              {profile?.university && <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>🎓 {profile.university}</div>}
            </div>
          </motion.div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} {profile?.name || 'Rajiv Mehta'}. All rights reserved.</p>
          <p className="text-xs text-slate-500">Built with MERN Stack · Designed with ❤️</p>
        </div>
      </div>
    </footer>
  );
}
