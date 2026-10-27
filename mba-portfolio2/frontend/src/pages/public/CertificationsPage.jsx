import React, { useEffect, useState } from 'react';
import { ExternalLink, Calendar, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../utils/api';
import SectionHeader from '../../components/shared/SectionHeader';
import { SectionSkeleton } from '../../components/shared/Skeleton';

export default function CertificationsPage() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { API.get('/certifications').then((res) => setCerts(res.data.data || [])).finally(() => setLoading(false)); }, []);
  if (loading) return <SectionSkeleton />;
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';

  return (
    <div style={{ background: 'var(--color-bg)', paddingTop: '5rem' }}>
      <div className="section-padding">
        <div className="container-custom">
          <SectionHeader tag="Credentials" title="Certifications & Qualifications" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map((cert, i) => (
              <motion.div key={cert._id} className="card p-6"
                initial={{ opacity: 0, y: 28, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, boxShadow: 'var(--shadow-lg)' }}>
                <motion.div whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }} transition={{ duration: 0.4 }}
                  style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  {cert.image?.url
                    ? <img src={cert.image.url} alt={cert.name} style={{ width: 36, height: 36, objectFit: 'contain' }} />
                    : <Award size={24} style={{ color: 'var(--color-accent-hover)' }} />}
                </motion.div>
                <h3 style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }} className="font-heading">{cert.name}</h3>
                <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem' }}>{cert.issuer}</p>
                {cert.description && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.83rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{cert.description}</p>}
                <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                  {cert.issueDate && (
                    <span style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-1 text-xs">
                      <Calendar size={11} /> {fmt(cert.issueDate)}
                    </span>
                  )}
                  {cert.credentialUrl && (
                    <motion.a href={cert.credentialUrl} target="_blank" rel="noreferrer"
                      whileHover={{ x: 3 }}
                      style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
                      Verify <ExternalLink size={11} />
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
