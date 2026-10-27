import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { updateTheme } from '../../redux/slices/themeSlice';
import { AdminPageHeader } from '../../components/admin/AdminComponents';

const THEMES = [
  { id: 'light', label: 'Light', desc: 'Clean white professional look', bg: '#fafafa', text: '#0f172a', accent: '#d69e2e' },
  { id: 'dark', label: 'Dark', desc: 'Sophisticated dark professional', bg: '#0a0f1e', text: '#f1f5f9', accent: '#e9c537' },
  { id: 'corporate-blue', label: 'Corporate Blue', desc: 'Deep navy blue corporate feel', bg: '#eef2f8', text: '#051c5a', accent: '#d4ae2a' },
];

const LAYOUTS = [
  { id: 'modern', label: 'Modern Landing', desc: 'Full-width sections with large visuals — recommended' },
  { id: 'classic', label: 'Classic Corporate', desc: 'Sidebar + content layout, structured and dense' },
  { id: 'minimal', label: 'Minimal Cards', desc: 'Card-based clean minimal layout' },
];

export default function AdminTheme() {
  const dispatch = useDispatch();
  const { activeTheme, activeLayout, loading } = useSelector((s) => s.theme);
  const [selectedTheme, setSelectedTheme] = useState(activeTheme);
  const [selectedLayout, setSelectedLayout] = useState(activeLayout);

  useEffect(() => { setSelectedTheme(activeTheme); setSelectedLayout(activeLayout); }, [activeTheme, activeLayout]);

  const handleSave = async () => {
    try {
      await dispatch(updateTheme({ activeTheme: selectedTheme, activeLayout: selectedLayout }));
      toast.success('Theme settings saved!');
    } catch { toast.error('Failed to save theme'); }
  };

  return (
    <div>
      <AdminPageHeader title="Theme & Layout" subtitle="Customize the look and feel of your portfolio" />

      {/* Theme Selection */}
      <div className="card p-6 mb-6">
        <h2 style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Color Theme</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {THEMES.map((theme) => (
            <button key={theme.id} onClick={() => setSelectedTheme(theme.id)}
              style={{
                border: `2px solid ${selectedTheme === theme.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 12, padding: '1rem', background: selectedTheme === theme.id ? 'var(--color-bg-secondary)' : 'var(--color-surface)',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
              }}>
              {/* Preview swatch */}
              <div style={{ height: 60, borderRadius: 8, background: theme.bg, border: '1px solid #e2e8f0', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: theme.text }} />
                <div style={{ width: 30, height: 8, borderRadius: 4, background: theme.text, opacity: 0.6 }} />
                <div style={{ width: 16, height: 16, borderRadius: 4, background: theme.accent }} />
              </div>
              <div style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{theme.label}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{theme.desc}</div>
              {selectedTheme === theme.id && (
                <div style={{ marginTop: 8, color: 'var(--color-primary)', fontSize: '0.78rem', fontWeight: 700 }}>✓ Active</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Layout Selection */}
      <div className="card p-6 mb-6">
        <h2 style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Page Layout</h2>
        <div className="space-y-3">
          {LAYOUTS.map((layout) => (
            <button key={layout.id} onClick={() => setSelectedLayout(layout.id)}
              style={{
                width: '100%', border: `2px solid ${selectedLayout === layout.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 10, padding: '1rem 1.25rem', background: selectedLayout === layout.id ? 'var(--color-bg-secondary)' : 'var(--color-surface)',
                cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s',
              }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selectedLayout === layout.id ? 'var(--color-primary)' : 'var(--color-border)'}`, background: selectedLayout === layout.id ? 'var(--color-primary)' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedLayout === layout.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
              </div>
              <div>
                <div style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '0.9rem' }}>{layout.label}</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{layout.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : 'Save Theme Settings'}
        </button>
        <a href="/" target="_blank" rel="noreferrer" className="btn-secondary">
          Preview Portfolio ↗
        </a>
      </div>
    </div>
  );
}
