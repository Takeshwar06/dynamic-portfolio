import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../../utils/api';
import SectionHeader from '../../components/shared/SectionHeader';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error('Please fill required fields');
    setLoading(true);
    try {
      await API.post('/contact', form);
      setSent(true);
      toast.success("Message sent! I'll get back to you soon.");
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    background: 'var(--color-bg-secondary)',
    border: '1.5px solid var(--color-border)',
    borderRadius: 8, color: 'var(--color-text-primary)',
    fontFamily: 'DM Sans, sans-serif', fontSize: '0.92rem', outline: 'none',
    transition: 'border-color 0.2s',
  };

  const INFO = [
    { icon: Mail, label: 'Email', value: 'rajiv.mehta@example.com', href: 'mailto:rajiv.mehta@example.com' },
    { icon: Phone, label: 'Phone', value: '+91 9876543210' },
    { icon: MapPin, label: 'Location', value: 'Mumbai, India' },
    { icon: Linkedin, label: 'LinkedIn', value: 'Connect on LinkedIn', href: 'https://linkedin.com' },
  ];

  return (
    <div style={{ background: 'var(--color-bg)', paddingTop: '5rem' }}>
      <div className="section-padding">
        <div className="container-custom">
          <SectionHeader tag="Contact" title="Let's Connect" subtitle="Have an opportunity, collaboration, or just want to chat strategy? I'd love to hear from you." centered />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            {/* Info */}
            <motion.div className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
              {INFO.map((item, i) => (
                <motion.div key={item.label} className="flex items-start gap-4"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }}
                    style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon size={18} style={{ color: 'var(--color-accent-hover)' }} />
                  </motion.div>
                  <div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{item.label}</div>
                    {item.href ? (
                      <a href={item.href} style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }} className="hover:text-primary transition-colors">{item.value}</a>
                    ) : (
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{item.value}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Form */}
            <motion.div className="lg:col-span-3"
              initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="card p-10 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 250, delay: 0.1 }}
                      style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                      <Send size={32} style={{ color: 'var(--color-accent-hover)' }} />
                    </motion.div>
                    <h3 style={{ color: 'var(--color-text-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }} className="font-heading">Message Sent!</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Thank you for reaching out. I'll get back to you within 24 hours.</p>
                    <button onClick={() => setSent(false)} className="btn-secondary text-sm py-2">Send Another</button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="card p-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {['name', 'email'].map((field, i) => (
                        <motion.div key={field} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                          <label style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                            {field.charAt(0).toUpperCase() + field.slice(1)} *
                          </label>
                          <input name={field} type={field === 'email' ? 'email' : 'text'} value={form[field]} onChange={handleChange}
                            placeholder={field === 'name' ? 'Your full name' : 'your@email.com'} style={inputStyle} required
                            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'} />
                        </motion.div>
                      ))}
                    </div>
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
                      <label style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Subject</label>
                      <input name="subject" value={form.subject} onChange={handleChange} placeholder="e.g. Internship opportunity" style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
                      <label style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Message *</label>
                      <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me about the opportunity..." style={{ ...inputStyle, minHeight: 140, resize: 'vertical' }} required
                        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'} />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                        {loading ? (
                          <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} /> Sending...</>
                        ) : (
                          <><Send size={15} /> Send Message</>
                        )}
                      </button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
