import React, { useEffect, useState } from 'react';
import { Download, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../utils/api';
import SectionHeader from '../../components/shared/SectionHeader';

export default function ResumePage() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { API.get('/resume').then((res) => setResume(res.data.data)).finally(() => setLoading(false)); }, []);

  return (
    <div style={{ background: 'var(--color-bg)', paddingTop: '5rem' }}>
      <div className="section-padding">
        <div className="container-custom max-w-4xl">
          <SectionHeader tag="Resume" title="Curriculum Vitae" subtitle="Download or preview my resume to learn more about my experience, education, and achievements." centered />
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ width: 36, height: 36, border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} />
            </div>
          ) : !resume ? (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="card p-12 text-center">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <FileText size={56} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
              </motion.div>
              <p style={{ color: 'var(--color-text-muted)' }}>Resume not available yet. Please check back later.</p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <motion.a href={resume.file?.url} download className="btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Download size={16} /> Download Resume
                </motion.a>
                <motion.a href={resume.file?.url} target="_blank" rel="noreferrer" className="btn-secondary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <ExternalLink size={16} /> Open in New Tab
                </motion.a>
              </div>
              <motion.div className="card overflow-hidden" style={{ boxShadow: 'var(--shadow-xl)' }}
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
                <div style={{ background: 'var(--color-bg-secondary)', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={15} style={{ color: 'var(--color-text-muted)' }} />
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>{resume.title || 'Resume'} {resume.version && `v${resume.version}`}</span>
                </div>
                <iframe src={resume.file?.url} title="Resume Preview" style={{ width: '100%', height: '85vh', border: 'none', display: 'block' }} />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
