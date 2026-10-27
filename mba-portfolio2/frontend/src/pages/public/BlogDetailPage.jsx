import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Eye, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../utils/api';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { API.get(`/blogs/${slug}`).then((res) => setBlog(res.data.data)).finally(() => setLoading(false)); }, [slug]);
  if (loading) return <div style={{ minHeight: '100vh', paddingTop: '6rem', background: 'var(--color-bg)' }} className="flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 32, height: 32, border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} /></div>;
  if (!blog) return <div style={{ minHeight: '100vh', paddingTop: '6rem', background: 'var(--color-bg)' }} className="flex flex-col items-center justify-center gap-4"><h2 style={{ color: 'var(--color-text-primary)' }} className="font-heading text-2xl">Article not found</h2><Link to="/blog" className="btn-primary">Back to Blog</Link></div>;
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div style={{ background: 'var(--color-bg)', paddingTop: '5rem' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
        style={{ background: 'var(--color-bg-secondary)', padding: '3rem 0' }}>
        <div className="container-custom max-w-3xl">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Link to="/blog" style={{ color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', marginBottom: '1.5rem', textDecoration: 'none' }} className="hover:text-primary transition-colors">
              <ArrowLeft size={14} /> Back to Insights
            </Link>
          </motion.div>
          {blog.category && <motion.span initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent-hover)', padding: '3px 12px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700 }}>{blog.category}</motion.span>}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ color: 'var(--color-text-primary)', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontFamily: 'Playfair Display, serif', fontWeight: 700, margin: '0.75rem 0 1rem' }}>
            {blog.title}
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex flex-wrap gap-4">
            <span style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-1 text-sm"><Calendar size={13} /> {fmt(blog.publishedAt)}</span>
            <span style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-1 text-sm"><Clock size={13} /> {blog.readTime} min read</span>
            <span style={{ color: 'var(--color-text-muted)' }} className="flex items-center gap-1 text-sm"><Eye size={13} /> {blog.views} views</span>
          </motion.div>
        </div>
      </motion.div>

      {blog.coverImage?.url && (
        <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3 }}
          className="container-custom max-w-3xl -mt-6 mb-8">
          <img src={blog.coverImage.url} alt={blog.title} style={{ width: '100%', borderRadius: 16, boxShadow: 'var(--shadow-lg)', maxHeight: 380, objectFit: 'cover' }} />
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="container-custom max-w-3xl pb-16">
        {blog.excerpt && <p style={{ color: 'var(--color-primary)', fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.7, borderLeft: '3px solid var(--color-accent)', paddingLeft: '1.25rem', marginBottom: '2rem' }}>{blog.excerpt}</p>}
        <div className="prose" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.9, fontSize: '0.97rem' }}
          dangerouslySetInnerHTML={{ __html: blog.content || '<p>Content coming soon...</p>' }} />
        {blog.tags?.length > 0 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-wrap gap-2 mt-10 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
            <Tag size={14} style={{ color: 'var(--color-text-muted)', marginTop: 2 }} />
            {blog.tags.map((tag) => (
              <motion.span key={tag} whileHover={{ scale: 1.08 }}
                style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)', padding: '3px 10px', borderRadius: 100, fontSize: '0.78rem', fontWeight: 600 }}>{tag}</motion.span>
            ))}
          </motion.div>
        )}
        <div className="mt-8"><Link to="/blog" className="btn-secondary"><ArrowLeft size={16} /> Back to Insights</Link></div>
      </motion.div>
    </div>
  );
}
