import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../utils/api';
import SectionHeader from '../../components/shared/SectionHeader';
import { SectionSkeleton } from '../../components/shared/Skeleton';

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/experiences').then((res) => setExperiences(res.data.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <SectionSkeleton />;
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';

  return (
    <div style={{ background: 'var(--color-bg)', paddingTop: '5rem' }}>
      <div className="section-padding">
        <div className="container-custom max-w-4xl">
          <SectionHeader tag="Career" title="Professional Experience" subtitle="A track record of driving measurable impact across consulting, strategy, and operations." />

          <div className="relative">
            {/* Timeline line */}
            <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: 'easeInOut' }}
              style={{ position: 'absolute', left: 20, top: 0, bottom: 0, width: 2, background: 'var(--color-border)', transformOrigin: 'top' }}
              className="hidden md:block" />

            <div className="space-y-8">
              {experiences.map((exp, i) => (
                <motion.div key={exp._id}
                  initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: 'relative' }}>
                  {/* Dot */}
                  <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.12 + 0.3, type: 'spring', stiffness: 300 }}
                    className="hidden md:block"
                    style={{ position: 'absolute', left: 12, top: 24, width: 18, height: 18, borderRadius: '50%', background: exp.isCurrent ? 'var(--color-accent)' : 'var(--color-primary)', border: '3px solid var(--color-bg)', boxShadow: '0 0 0 2px ' + (exp.isCurrent ? 'var(--color-accent)' : 'var(--color-primary)'), zIndex: 1 }} />

                  <motion.div className="md:ml-12 card p-6" whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-4">
                        {exp.logo?.url ? (
                          <img src={exp.logo.url} alt={exp.company} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'contain', border: '1px solid var(--color-border)', flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                            {exp.company?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '1.05rem' }} className="font-heading">{exp.title}</h3>
                          <div style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem' }}>{exp.company}</div>
                          <div className="flex flex-wrap gap-3 mt-1">
                            <span style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-1 text-xs">
                              <Calendar size={11} /> {fmt(exp.startDate)} – {exp.isCurrent ? 'Present' : fmt(exp.endDate)}
                            </span>
                            {exp.location && <span style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-1 text-xs"><MapPin size={11} /> {exp.location}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {exp.isCurrent && <span style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent-hover)', padding: '2px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700 }}>Current</span>}
                        {exp.type && <span style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)', padding: '2px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600 }}>{exp.type}</span>}
                      </div>
                    </div>

                    {exp.description && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>{exp.description}</p>}

                    {exp.metrics?.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-4">
                        {exp.metrics.map((m, mi) => (
                          <motion.div key={mi} whileHover={{ scale: 1.05 }}
                            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <TrendingUp size={12} style={{ color: 'var(--color-accent)' }} />
                            <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.85rem' }}>{m.value}</span>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{m.label}</span>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {exp.achievements?.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {exp.achievements.map((ach, ai) => (
                          <motion.li key={ai} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: ai * 0.06 }}
                            style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', marginTop: 3, flexShrink: 0 }} />
                            {ach}
                          </motion.li>
                        ))}
                      </ul>
                    )}

                    {exp.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {exp.skills.map((skill) => (
                          <motion.span key={skill} whileHover={{ scale: 1.08, y: -1 }}
                            style={{ background: 'var(--color-border-light)', color: 'var(--color-text-muted)', padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 600, cursor: 'default' }}>
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
