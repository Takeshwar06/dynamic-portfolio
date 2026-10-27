import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Linkedin, Github, MapPin, GraduationCap, ChevronDown, TrendingUp } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import API from '../../utils/api';

// Animated counter
function Counter({ target, suffix = '', inView }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target, 10);
    if (isNaN(num)) return;
    let start = 0;
    const step = num / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span>{count}{suffix}</span>;
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } } };

export default function HomePage() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    Promise.all([API.get('/profile'), API.get('/projects')])
      .then(([p, pr]) => {
        setProfile(p.data.data);
        setProjects(pr.data.data?.filter(x => x.isFeatured)?.slice(0, 3) || pr.data.data?.slice(0, 3) || []);
      }).catch(() => {});
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsInView(true); obs.disconnect(); } }, { threshold: 0.4 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const STATS = [
    { label: 'Years Experience', value: '4', suffix: '+' },
    { label: 'Projects Completed', value: '12', suffix: '+' },
    { label: 'Industries Served', value: '5', suffix: '+' },
  ];

  return (
    <div style={{ background: 'var(--color-bg)' }}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ minHeight: '100vh', paddingTop: '5rem', position: 'relative', overflow: 'hidden' }} className="flex items-center">
        {/* Animated background blobs */}
        <motion.div animate={{ scale: [1, 1.08, 1], x: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '8%', right: '5%', width: 420, height: 420, background: 'radial-gradient(circle, rgba(214,158,46,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <motion.div animate={{ scale: [1, 1.05, 1], x: [0, -15, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ position: 'absolute', bottom: '10%', left: '3%', width: 320, height: 320, background: 'radial-gradient(circle, rgba(26,54,93,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        {/* Decorative grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--color-border) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.4, pointerEvents: 'none' }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container-custom w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-16">
            {/* Text */}
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.div variants={fadeUp}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--color-accent-light)', border: '1px solid rgba(214,158,46,0.4)', borderRadius: 100, padding: '0.35rem 1rem', marginBottom: '1.5rem' }}>
                  <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 8, height: 8, background: 'var(--color-accent)', borderRadius: '50%', display: 'inline-block' }} />
                  <span style={{ color: 'var(--color-accent-hover)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em' }}>Open to Opportunities</span>
                </div>
              </motion.div>

              <motion.h1 variants={fadeUp} style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, lineHeight: 1.1, color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
                {profile?.name || 'Rajiv Mehta'}
              </motion.h1>

              <motion.p variants={fadeUp} style={{ fontSize: 'clamp(1.05rem, 2vw, 1.3rem)', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '1.25rem' }}>
                {profile?.tagline || 'MBA Candidate · Strategy & Operations · Consulting'}
              </motion.p>

              <motion.p variants={fadeUp} style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.85, marginBottom: '2rem', maxWidth: 520 }}>
                {profile?.shortBio || 'Strategy-focused MBA candidate with 4+ years in management consulting, driving measurable impact through data-driven decisions.'}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-8">
                {profile?.location && (
                  <div style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-1.5 text-sm">
                    <MapPin size={14} /> {profile.location}
                  </div>
                )}
                {profile?.university && (
                  <div style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-1.5 text-sm">
                    <GraduationCap size={14} /> {profile.university}
                  </div>
                )}
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-8">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/projects" className="btn-primary">View Case Studies <ArrowRight size={16} /></Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/resume" className="btn-secondary"><Download size={16} /> Resume</Link>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex gap-3">
                {profile?.linkedin && (
                  <motion.a href={profile.linkedin} target="_blank" rel="noreferrer" whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.95 }}
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Linkedin size={16} />
                  </motion.a>
                )}
                {profile?.github && (
                  <motion.a href={profile.github} target="_blank" rel="noreferrer" whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.95 }}
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Github size={16} />
                  </motion.a>
                )}
              </motion.div>
            </motion.div>

            {/* Right: Avatar + Stats */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-8">
              {/* Avatar with ring */}
              <div style={{ position: 'relative' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  style={{ position: 'absolute', inset: -16, borderRadius: '50%', border: '2px dashed var(--color-accent)', opacity: 0.3 }} />
                <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.4 }}
                  style={{ width: 260, height: 260, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', padding: 4 }}
                  className="animate-pulse-glow">
                  {profile?.avatar?.url ? (
                    <img src={profile.avatar.url} alt={profile.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--color-bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', fontFamily: 'Playfair Display, serif', color: 'var(--color-primary)' }}>
                      {profile?.name?.charAt(0) || 'R'}
                    </div>
                  )}
                </motion.div>
                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.1 }}
                  style={{ position: 'absolute', bottom: 10, right: -16, background: 'var(--color-surface)', border: '2px solid var(--color-accent)', borderRadius: 12, padding: '8px 14px', boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>MBA</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)', fontWeight: 800 }}>{profile?.graduationYear || '2025'}</div>
                </motion.div>
              </div>

              {/* Stats */}
              <div ref={statsRef} className="grid grid-cols-3 gap-4 w-full max-w-sm">
                {STATS.map((stat, i) => (
                  <motion.div key={stat.label}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ scale: 1.06, y: -4 }}
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '16px', textAlign: 'center', boxShadow: 'var(--shadow-sm)', cursor: 'default' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1 }}>
                      <Counter target={stat.value} suffix={stat.suffix} inView={statsInView} />
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex justify-center pb-8">
            <motion.a href="#featured" animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
              style={{ color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none', fontSize: '0.75rem' }}>
              Scroll to explore <ChevronDown size={16} />
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* ── FEATURED PROJECTS ────────────────────────────────────────────── */}
      {projects.length > 0 && (
        <section id="featured" className="section-padding">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-10">
              <div>
                <motion.div initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="section-tag">Featured Work</motion.div>
                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                  style={{ color: 'var(--color-text-primary)', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }} className="font-heading font-bold">
                  Case Studies
                </motion.h2>
                <motion.div initial={{ width: 0 }} whileInView={{ width: 60 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.25 }} className="divider-line" style={{ width: undefined }} />
              </div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <Link to="/projects" style={{ color: 'var(--color-primary)' }} className="hidden md:flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all">
                  View all <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <motion.div key={project._id}
                  initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}>
                  <Link to={`/projects/${project.slug}`} className="card p-6 block group h-full" style={{ display: 'flex', flexDirection: 'column' }}>
                    {project.coverImage?.url && (
                      <div style={{ height: 160, borderRadius: 8, overflow: 'hidden', marginBottom: '1rem' }}>
                        <motion.img src={project.coverImage.url} alt={project.title}
                          whileHover={{ scale: 1.07 }} transition={{ duration: 0.4 }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.category && <span style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent-hover)', padding: '2px 8px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700 }}>{project.category}</span>}
                      {project.industry && <span style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)', padding: '2px 8px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600 }}>{project.industry}</span>}
                    </div>
                    <h3 style={{ color: 'var(--color-text-primary)', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.4 }} className="font-heading">{project.title}</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, flex: 1 }} className="mb-4 line-clamp-2">{project.tagline}</p>
                    {project.metrics?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.metrics.slice(0, 2).map((m, mi) => (
                          <div key={mi} style={{ background: 'var(--color-bg-secondary)', borderRadius: 8, padding: '5px 10px' }}>
                            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{m.value}</div>
                            <div style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{m.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <motion.div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}
                      whileHover={{ gap: 8 }} transition={{ duration: 0.2 }}>
                      Read Case Study <ArrowRight size={14} />
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
        style={{ background: 'var(--color-primary)', padding: '4.5rem 0', position: 'relative', overflow: 'hidden' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, border: '1px solid rgba(255,255,255,0.06)', borderRadius: '50%', pointerEvents: 'none' }} />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', bottom: -80, left: -80, width: 220, height: 220, border: '1px solid rgba(255,255,255,0.04)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div className="container-custom text-center relative z-10">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ color: 'white', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: '1rem' }} className="font-heading font-bold">
            Let's build something exceptional together
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.72)', marginBottom: '2rem' }}>
            Looking for a strategic thinker who can drive results? Let's connect.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/contact" style={{ background: 'white', color: 'var(--color-primary)', padding: '0.75rem 2rem', borderRadius: 8, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                Get In Touch <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/resume" style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.45)', padding: '0.75rem 2rem', borderRadius: 8, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <Download size={16} /> View Resume
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
