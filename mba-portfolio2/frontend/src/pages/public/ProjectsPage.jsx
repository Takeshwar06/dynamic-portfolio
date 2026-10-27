import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Users, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../utils/api';
import SectionHeader from '../../components/shared/SectionHeader';
import { SectionSkeleton } from '../../components/shared/Skeleton';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    API.get('/projects').then((res) => setProjects(res.data.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <SectionSkeleton count={4} />;

  const categories = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))];
  const filtered = activeFilter === 'All' ? projects : projects.filter((p) => p.category === activeFilter);

  return (
    <div style={{ background: 'var(--color-bg)', paddingTop: '5rem' }}>
      <div className="section-padding">
        <div className="container-custom">
          <SectionHeader tag="Case Studies" title="Projects & Strategic Work" subtitle="Real-world business challenges solved with structured frameworks, data analysis, and strategic insight." />

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <motion.button key={cat} onClick={() => setActiveFilter(cat)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{
                  background: activeFilter === cat ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: activeFilter === cat ? 'white' : 'var(--color-text-secondary)',
                  border: '1px solid ' + (activeFilter === cat ? 'var(--color-primary)' : 'var(--color-border)'),
                  padding: '0.4rem 1.1rem', borderRadius: 100, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                  position: 'relative',
                }}>
                {activeFilter === cat && (
                  <motion.div layoutId="filter-bg"
                    style={{ position: 'absolute', inset: 0, background: 'var(--color-primary)', borderRadius: 100, zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }} />
                )}
                {cat}
              </motion.button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '4rem' }}>No projects found.</motion.div>
          ) : (
            <motion.div layout className="space-y-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((project, i) => (
                  <motion.div key={project._id} layout
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="card overflow-hidden"
                    style={{ display: 'grid', gridTemplateColumns: project.coverImage?.url ? 'clamp(200px, 28%, 300px) 1fr' : '1fr' }}>
                    {project.coverImage?.url && (
                      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 220 }}>
                        <motion.img src={project.coverImage.url} alt={project.title}
                          whileHover={{ scale: 1.07 }} transition={{ duration: 0.4 }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                        {project.isFeatured && (
                          <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--color-accent)', color: 'var(--color-primary)', padding: '3px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700 }}>⭐ Featured</div>
                        )}
                      </div>
                    )}
                    <div style={{ padding: '2rem' }}>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.category && <span style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent-hover)', padding: '2px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700 }}>{project.category}</span>}
                        {project.industry && <span style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)', padding: '2px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600 }}>{project.industry}</span>}
                      </div>
                      <h3 style={{ color: 'var(--color-text-primary)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }} className="font-heading">{project.title}</h3>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.7 }}>{project.tagline}</p>
                      <div className="flex flex-wrap gap-4 mb-4">
                        {project.duration && <div style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-1.5 text-xs"><Clock size={12} /> {project.duration}</div>}
                        {project.teamSize && <div style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-1.5 text-xs"><Users size={12} /> Team of {project.teamSize}</div>}
                        {project.role && <div style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-1.5 text-xs"><Briefcase size={12} /> {project.role}</div>}
                      </div>
                      {project.metrics?.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-4">
                          {project.metrics.map((m, mi) => (
                            <motion.div key={mi} whileHover={{ scale: 1.06, y: -2 }}
                              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{m.value}</div>
                              <div style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>{m.label}</div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                      {project.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.tags.map((tag) => (
                            <span key={tag} style={{ background: 'var(--color-border-light)', color: 'var(--color-text-muted)', padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem' }}>{tag}</span>
                          ))}
                        </div>
                      )}
                      <motion.div whileHover={{ x: 4 }}>
                        <Link to={`/projects/${project.slug}`} style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          Read Full Case Study <ArrowRight size={14} />
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
