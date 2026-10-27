import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import API from '../../utils/api';
import SectionHeader from '../../components/shared/SectionHeader';
import { SectionSkeleton } from '../../components/shared/Skeleton';

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/skills').then((res) => setSkills(res.data.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <SectionSkeleton />;

  return (
    <div style={{ background: 'var(--color-bg)', paddingTop: '5rem' }}>
      <div className="section-padding">
        <div className="container-custom">
          <SectionHeader tag="Competencies" title="Skills & Expertise" subtitle="A diverse skill set spanning strategic thinking, data analytics, and cross-functional leadership." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((category, ci) => (
              <motion.div key={category._id} className="card p-6"
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: ci * 0.1, ease: [0.22, 1, 0.36, 1] }}>
                <h3 style={{ color: 'var(--color-text-primary)', fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.items?.map((item, ii) => (
                    <motion.div key={ii}
                      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                      transition={{ delay: ci * 0.1 + ii * 0.06 }}>
                      <div className="flex justify-between mb-1.5">
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{item.name}</span>
                        <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: ci * 0.1 + ii * 0.06 + 0.5 }}
                          style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>{item.level}%</motion.span>
                      </div>
                      <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 100, height: 8, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }} whileInView={{ width: `${item.level}%` }} viewport={{ once: true }}
                          transition={{ duration: 1.1, delay: ci * 0.1 + ii * 0.06, ease: [0.22, 1, 0.36, 1] }}
                          style={{ height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))', borderRadius: 100 }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
