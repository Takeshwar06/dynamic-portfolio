import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../utils/api';
import SectionHeader from '../../components/shared/SectionHeader';
import { SectionSkeleton } from '../../components/shared/Skeleton';

export default function LeadershipPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { API.get('/leadership').then((res) => setItems(res.data.data || [])).finally(() => setLoading(false)); }, []);
  if (loading) return <SectionSkeleton />;
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

  return (
    <div style={{ background: 'var(--color-bg)', paddingTop: '5rem' }}>
      <div className="section-padding">
        <div className="container-custom max-w-4xl">
          <SectionHeader tag="Leadership" title="Leadership & Activities" subtitle="Beyond academics — driving impact through campus leadership, clubs, and community initiatives." />
          <div className="space-y-6">
            {items.map((item, i) => (
              <motion.div key={item._id} className="card p-6"
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}>
                <div className="flex items-start gap-4">
                  <motion.div whileHover={{ scale: 1.1, rotate: 3 }} transition={{ duration: 0.25 }}>
                    {item.image?.url ? (
                      <img src={item.image.url} alt={item.organization} style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 52, height: 52, borderRadius: 10, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.25rem', flexShrink: 0 }}>
                        {item.organization?.charAt(0)}
                      </div>
                    )}
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '1rem' }} className="font-heading">{item.title}</h3>
                        <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem' }}>{item.organization}</p>
                      </div>
                      {item.isCurrent && <span style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent-hover)', padding: '2px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700 }}>Active</span>}
                    </div>
                    {(item.startDate || item.endDate) && (
                      <div style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-1 text-xs mb-3">
                        <Calendar size={11} /> {fmt(item.startDate)} – {item.isCurrent ? 'Present' : fmt(item.endDate)}
                      </div>
                    )}
                    {item.description && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>{item.description}</p>}
                    {item.achievements?.length > 0 && (
                      <ul className="space-y-1.5">
                        {item.achievements.map((ach, ai) => (
                          <motion.li key={ai} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: ai * 0.07 }}
                            style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                            <CheckCircle2 size={13} style={{ color: 'var(--color-primary)', marginTop: 3, flexShrink: 0 }} />
                            {ach}
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
