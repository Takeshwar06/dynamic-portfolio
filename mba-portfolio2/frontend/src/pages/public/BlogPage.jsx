import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../utils/api';
import SectionHeader from '../../components/shared/SectionHeader';
import { SectionSkeleton } from '../../components/shared/Skeleton';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('All');
  useEffect(() => { API.get('/blogs').then((res) => setBlogs(res.data.data || [])).finally(() => setLoading(false)); }, []);
  if (loading) return <SectionSkeleton />;
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const allTags = ['All', ...new Set(blogs.flatMap((b) => b.tags || []))];
  const filtered = activeTag === 'All' ? blogs : blogs.filter((b) => b.tags?.includes(activeTag));
  const featured = blogs.find((b) => b.isFeatured);

  return (
    <div style={{ background: 'var(--color-bg)', paddingTop: '5rem' }}>
      <div className="section-padding">
        <div className="container-custom">
          <SectionHeader tag="Insights" title="Business Insights & Analysis" subtitle="Perspectives on strategy, markets, and management from the consulting trenches." />

          {featured && (
            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-10">
              <Link to={`/blog/${featured.slug}`} className="card block overflow-hidden group">
                <div style={{ display: 'grid', gridTemplateColumns: featured.coverImage?.url ? '1fr 1fr' : '1fr' }}>
                  {featured.coverImage?.url && (
                    <div style={{ overflow: 'hidden', maxHeight: 280 }}>
                      <motion.img src={featured.coverImage.url} alt={featured.title}
                        whileHover={{ scale: 1.06 }} transition={{ duration: 0.5 }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: '2.5rem' }}>
                    <span style={{ background: 'var(--color-accent)', color: 'var(--color-primary)', padding: '2px 10px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700 }}>⭐ Featured</span>
                    <h2 style={{ color: 'var(--color-text-primary)', fontSize: '1.35rem', margin: '0.75rem 0 0.5rem' }} className="font-heading font-bold">{featured.title}</h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>{featured.excerpt}</p>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <span style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-1 text-xs"><Calendar size={11} /> {fmt(featured.publishedAt)}</span>
                      <span style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-1 text-xs"><Clock size={11} /> {featured.readTime} min</span>
                      <span style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-1 text-xs"><Eye size={11} /> {featured.views}</span>
                    </div>
                    <motion.div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: 4 }} whileHover={{ gap: 8 }}>
                      Read Article <ArrowRight size={14} />
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          <div className="flex flex-wrap gap-2 mb-8">
            {allTags.map((tag) => (
              <motion.button key={tag} onClick={() => setActiveTag(tag)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{ background: activeTag === tag ? 'var(--color-primary)' : 'var(--color-surface)', color: activeTag === tag ? 'white' : 'var(--color-text-secondary)', border: '1px solid ' + (activeTag === tag ? 'var(--color-primary)' : 'var(--color-border)'), padding: '0.35rem 0.9rem', borderRadius: 100, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                {tag}
              </motion.button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.filter((b) => !b.isFeatured).map((blog, i) => (
                <motion.div key={blog._id} layout initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.45, delay: i * 0.07 }}>
                  <Link to={`/blog/${blog.slug}`} className="card block group h-full">
                    {blog.coverImage?.url && (
                      <div style={{ height: 180, overflow: 'hidden', borderRadius: '14px 14px 0 0' }}>
                        <motion.img src={blog.coverImage.url} alt={blog.title} whileHover={{ scale: 1.07 }} transition={{ duration: 0.4 }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ padding: '1.25rem' }}>
                      {blog.category && <span style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)', padding: '2px 8px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{blog.category}</span>}
                      <h3 style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '1rem', margin: '0.5rem 0', lineHeight: 1.4 }} className="font-heading">{blog.title}</h3>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.83rem', lineHeight: 1.6, marginBottom: '0.75rem' }} className="line-clamp-2">{blog.excerpt}</p>
                      <div className="flex flex-wrap gap-3">
                        <span style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-1 text-xs"><Calendar size={10} /> {fmt(blog.publishedAt)}</span>
                        <span style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-1 text-xs"><Clock size={10} /> {blog.readTime} min</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
