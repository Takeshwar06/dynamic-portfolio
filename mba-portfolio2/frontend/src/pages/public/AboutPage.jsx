import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../utils/api';
import SectionHeader from '../../components/shared/SectionHeader';

export default function AboutPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { API.get('/profile').then((res) => setProfile(res.data.data)).finally(() => setLoading(false)); }, []);

  if (loading) return <div style={{ minHeight: '80vh', paddingTop: '6rem', background: 'var(--color-bg)' }} className="flex items-center justify-center"><div style={{ color: 'var(--color-text-muted)' }}>Loading...</div></div>;

  const contactItems = [
    profile?.email && { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    profile?.phone && { icon: Phone, label: 'Phone', value: profile.phone },
    profile?.location && { icon: MapPin, label: 'Location', value: profile.location },
    profile?.linkedin && { icon: Linkedin, label: 'LinkedIn', value: 'LinkedIn Profile', href: profile.linkedin },
    profile?.github && { icon: Github, label: 'GitHub', value: 'GitHub Profile', href: profile.github },
  ].filter(Boolean);

  return (
    <div style={{ background: 'var(--color-bg)', paddingTop: '5rem' }}>
      <div className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Sidebar */}
            <motion.div className="lg:col-span-1 space-y-4"
              initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <div className="card p-6 text-center">
                <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.3 }} style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                  {profile?.avatar?.url ? (
                    <img src={profile.avatar.url} alt={profile.name} style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-accent)' }} />
                  ) : (
                    <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'white', fontFamily: 'Playfair Display, serif' }}>
                      {profile?.name?.charAt(0) || 'R'}
                    </div>
                  )}
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}
                    style={{ position: 'absolute', bottom: 4, right: 4, width: 16, height: 16, borderRadius: '50%', background: '#22c55e', border: '2px solid var(--color-surface)' }} />
                </motion.div>
                <h2 style={{ color: 'var(--color-text-primary)', fontSize: '1.25rem', marginBottom: 4 }} className="font-heading font-bold">{profile?.name}</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{profile?.tagline}</p>
              </div>

              <div className="card p-6">
                <h3 style={{ color: 'var(--color-text-primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.85rem' }}>Contact</h3>
                <div className="space-y-3">
                  {contactItems.map((item, i) => (
                    <motion.div key={item.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                      {item.href ? (
                        <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                          style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', textDecoration: 'none' }}
                          className="hover:text-primary transition-colors">
                          <item.icon size={14} style={{ color: 'var(--color-accent-hover)', flexShrink: 0 }} /> {item.value}
                        </a>
                      ) : (
                        <div style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                          <item.icon size={14} style={{ color: 'var(--color-accent-hover)', flexShrink: 0 }} /> {item.value}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {profile?.university && (
                <motion.div className="card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h3 style={{ color: 'var(--color-text-primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.85rem' }}>Education</h3>
                  <div className="flex items-start gap-3">
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <GraduationCap size={18} style={{ color: 'var(--color-accent-hover)' }} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--color-text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>{profile.mbaProgram}</div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>{profile.university}</div>
                      {profile.graduationYear && <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: 2 }}>Class of {profile.graduationYear}</div>}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Main bio */}
            <motion.div className="lg:col-span-2"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
              <SectionHeader tag="About Me" title={`Hello, I'm ${profile?.name?.split(' ')[0] || 'Rajiv'}`} />
              <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.9, fontSize: '1rem', whiteSpace: 'pre-line' }}>
                {profile?.bio || 'Profile bio will appear here.'}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
