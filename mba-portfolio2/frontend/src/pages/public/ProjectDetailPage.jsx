import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Briefcase, Target, BarChart2, Lightbulb, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../utils/api';

const CS_SECTIONS = [
  { key: 'problem', label: 'Problem Statement', icon: Target, color: '#dc2626' },
  { key: 'analysis', label: 'Analysis & Insights', icon: BarChart2, color: '#2563eb' },
  { key: 'strategy', label: 'Strategy & Approach', icon: Lightbulb, color: '#d97706' },
  { key: 'result', label: 'Results & Impact', icon: TrendingUp, color: '#059669' },
];

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { API.get(`/projects/${slug}`).then((res) => setProject(res.data.data)).finally(() => setLoading(false)); }, [slug]);

  if (loading) return <div style={{ minHeight: '100vh', paddingTop: '6rem', background: 'var(--color-bg)' }} className="flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 32, height: 32, border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} /></div>;
  if (!project) return <div style={{ minHeight: '100vh', paddingTop: '6rem', background: 'var(--color-bg)' }} className="flex flex-col items-center justify-center gap-4"><h2 style={{ color: 'var(--color-text-primary)' }} className="font-heading text-2xl">Project not found</h2><Link to="/projects" className="btn-primary">Back to Projects</Link></div>;

  return (
    <div style={{ background: 'var(--color-bg)', paddingTop: '5rem' }}>
      {/* Hero */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ background: 'var(--color-primary)', padding: '3rem 0', position: 'relative', overflow: 'hidden' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, border: '1px solid rgba(255,255,255,0.06)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Link to="/projects" style={{ color: 'rgba(255,255,255,0.65)', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', marginBottom: '1.5rem', textDecoration: 'none' }} className="hover:text-white transition-colors">
              <ArrowLeft size={14} /> Back to Case Studies
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-2 mb-4">
            {project.category && <span style={{ background: 'var(--color-accent)', color: 'var(--color-primary)', padding: '3px 12px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700 }}>{project.category}</span>}
            {project.industry && <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '3px 12px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600 }}>{project.industry}</span>}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ color: 'white', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontFamily: 'Playfair Display, serif', fontWeight: 700, marginBottom: '1rem', maxWidth: 700 }}>
            {project.title}
          </motion.h1>
          {project.tagline && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', maxWidth: 600 }}>{project.tagline}</motion.p>}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-6 mt-6">
            {[{ label: 'Duration', value: project.duration, icon: Clock }, { label: 'Team', value: project.teamSize && `Team of ${project.teamSize}`, icon: Users }, { label: 'Role', value: project.role, icon: Briefcase }].filter(m => m.value).map((m) => (
              <div key={m.label} className="flex items-center gap-2">
                <m.icon size={14} style={{ color: 'var(--color-accent)' }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>{m.label}: </span>
                <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>{m.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Cover Image */}
      {project.coverImage?.url && (
        <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
          className="container-custom -mt-8 mb-8">
          <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-xl)', maxHeight: 400 }}>
            <img src={project.coverImage.url} alt={project.title} style={{ width: '100%', objectFit: 'cover' }} />
          </div>
        </motion.div>
      )}

      {/* Metrics */}
      {project.metrics?.length > 0 && (
        <div className="container-custom mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {project.metrics.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.05, y: -4 }}
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '1.25rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 6 }}>{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Case study sections */}
      <div className="container-custom pb-16">
        <div className="space-y-6 max-w-3xl">
          {CS_SECTIONS.map(({ key, label, icon: Icon, color }, i) => {
            if (!project[key]) return null;
            return (
              <motion.div key={key} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ background: color + '10', borderBottom: `2px solid ${color}25`, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} style={{ background: color, borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} color="white" />
                  </motion.div>
                  <h3 style={{ color: 'var(--color-text-primary)', fontSize: '1rem', fontWeight: 700 }} className="font-heading">{label}</h3>
                </div>
                <div style={{ padding: '1.5rem', color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '0.95rem' }}>{project[key]}</div>
              </motion.div>
            );
          })}
        </div>

        {(project.tools?.length > 0 || project.frameworks?.length > 0) && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-10 max-w-3xl">
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }} className="font-heading text-lg font-bold">Tools & Frameworks</h3>
            <div className="flex flex-wrap gap-2">
              {[...(project.tools || []), ...(project.frameworks || [])].map((item) => (
                <motion.span key={item} whileHover={{ scale: 1.08, y: -2 }}
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', padding: '4px 12px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600, cursor: 'default' }}>
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10">
          <Link to="/projects" className="btn-secondary"><ArrowLeft size={16} /> Back to All Case Studies</Link>
        </motion.div>
      </div>
    </div>
  );
}
