import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FolderKanban, BookOpen, MessageSquare, Award, TrendingUp, ArrowRight } from 'lucide-react';
import API from '../../utils/api';

const StatCard = ({ icon: Icon, label, value, color, to }) => (
  <Link to={to} className="card p-6 block group">
    <div className="flex items-center justify-between mb-4">
      <div style={{ width: 44, height: 44, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={20} style={{ color }} />
      </div>
      <ArrowRight size={14} style={{ color: 'var(--color-text-muted)' }} className="group-hover:translate-x-1 transition-transform" />
    </div>
    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1, fontFamily: 'DM Sans, sans-serif' }}>{value ?? '—'}</div>
    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', fontWeight: 600, marginTop: 4 }}>{label}</div>
  </Link>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard/stats').then((res) => setStats(res.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ color: 'var(--color-text-primary)', fontSize: '1.75rem', fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>Dashboard</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>Overview of your portfolio content</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-6" style={{ height: 130 }}>
              <div className="skeleton h-10 w-10 rounded-lg mb-4" />
              <div className="skeleton h-8 w-16 mb-2" />
              <div className="skeleton h-4 w-24" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Briefcase} label="Experiences" value={stats?.experiences} color="#1a365d" to="/admin/experience" />
            <StatCard icon={FolderKanban} label="Case Studies" value={stats?.projects} color="#2563eb" to="/admin/projects" />
            <StatCard icon={BookOpen} label="Blog Posts" value={stats?.blogs} color="#059669" to="/admin/blog" />
            <StatCard icon={Award} label="Certifications" value={stats?.certifications} color="#d97706" to="/admin/certifications" />
            <StatCard icon={MessageSquare} label="Total Messages" value={stats?.contacts} color="#7c3aed" to="/admin/contacts" />
            <StatCard icon={TrendingUp} label="Unread Messages" value={stats?.unreadContacts} color="#dc2626" to="/admin/contacts" />
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { label: '+ Add Experience', to: '/admin/experience' },
                { label: '+ New Case Study', to: '/admin/projects' },
                { label: '+ Write Blog Post', to: '/admin/blog' },
                { label: '⚙ Theme Settings', to: '/admin/theme' },
                { label: '📄 Upload Resume', to: '/admin/resume' },
              ].map((action) => (
                <Link key={action.to} to={action.to} className="btn-secondary text-sm py-2 px-4">
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
