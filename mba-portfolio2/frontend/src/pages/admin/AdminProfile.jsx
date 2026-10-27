import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../utils/api';
import {
  AdminPageHeader, FormField, Input, Textarea, FileInput, Toggle,
} from '../../components/admin/AdminComponents';

const EMPTY = {
  name: '', tagline: '', bio: '', shortBio: '',
  email: '', phone: '', location: '',
  mbaProgram: '', university: '', graduationYear: '',
  linkedin: '', github: '', twitter: '', website: '',
  isVisible: true,
};

export default function AdminProfile() {
  const [form, setForm] = useState(EMPTY);
  const [avatarFile, setAvatarFile] = useState(null);
  const [heroFile, setHeroFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [heroPreview, setHeroPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/profile').then((res) => {
      if (res.data.data) {
        setForm({ ...EMPTY, ...res.data.data });
        setAvatarPreview(res.data.data.avatar?.url || '');
        setHeroPreview(res.data.data.heroImage?.url || '');
      }
    }).finally(() => setLoading(false));
  }, []);

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSave = async () => {
    if (!form.name) return toast.error('Name is required');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined && typeof v !== 'object') {
          fd.append(k, v);
        }
      });
      if (avatarFile) fd.append('avatar', avatarFile);
      if (heroFile) fd.append('heroImage', heroFile);

      await API.put('/profile', fd);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
        Loading profile...
      </div>
    );
  }

  const SectionDivider = ({ title }) => (
    <div style={{
      borderTop: '1px solid var(--color-border)',
      paddingTop: '1.5rem',
      marginTop: '1.5rem',
      marginBottom: '1rem',
    }}>
      <h3 style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {title}
      </h3>
    </div>
  );

  return (
    <div>
      <AdminPageHeader
        title="Profile"
        subtitle="Manage your personal information and portfolio intro"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Images */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 style={{ color: 'var(--color-text-primary)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>
              Profile Photo
            </h3>
            <FileInput
              accept="image/*"
              preview={avatarPreview}
              hint="Max 2MB · JPG, PNG, WebP · Shown in hero section"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
              }}
            />
          </div>

          <div className="card p-5">
            <h3 style={{ color: 'var(--color-text-primary)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>
              Hero / Cover Image
            </h3>
            <FileInput
              accept="image/*"
              preview={heroPreview}
              hint="Max 2MB · Used as background in hero section"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) { setHeroFile(file); setHeroPreview(URL.createObjectURL(file)); }
              }}
            />
          </div>

          <div className="card p-5">
            <Toggle
              checked={form.isVisible ?? true}
              onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
              label="Profile visible on portfolio"
            />
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-2 card p-6">
          {/* Basic Info */}
          <SectionDivider title="Basic Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              <Input value={form.name} onChange={f('name')} placeholder="e.g. Rajiv Mehta" />
            </FormField>
            <FormField label="Tagline">
              <Input value={form.tagline} onChange={f('tagline')} placeholder="MBA Candidate | Strategy & Consulting" />
            </FormField>
          </div>

          <FormField label="Short Bio" hint="Shown in hero section (1-2 lines)">
            <Input value={form.shortBio} onChange={f('shortBio')} placeholder="Brief intro for the hero section..." />
          </FormField>

          <FormField label="Full Bio" hint="Shown on About page">
            <Textarea value={form.bio} onChange={f('bio')} placeholder="Detailed professional biography..." rows={5} />
          </FormField>

          {/* Education */}
          <SectionDivider title="Education" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="MBA Program">
              <Input value={form.mbaProgram} onChange={f('mbaProgram')} placeholder="MBA in Strategy & Finance" />
            </FormField>
            <FormField label="University">
              <Input value={form.university} onChange={f('university')} placeholder="IIM Ahmedabad" />
            </FormField>
            <FormField label="Graduation Year">
              <Input value={form.graduationYear} onChange={f('graduationYear')} placeholder="2025" />
            </FormField>
          </div>

          {/* Contact */}
          <SectionDivider title="Contact Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Email">
              <Input type="email" value={form.email} onChange={f('email')} placeholder="rajiv@example.com" />
            </FormField>
            <FormField label="Phone">
              <Input value={form.phone} onChange={f('phone')} placeholder="+91 9876543210" />
            </FormField>
            <FormField label="Location">
              <Input value={form.location} onChange={f('location')} placeholder="Mumbai, India" />
            </FormField>
          </div>

          {/* Social */}
          <SectionDivider title="Social Links" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="LinkedIn URL">
              <Input value={form.linkedin} onChange={f('linkedin')} placeholder="https://linkedin.com/in/..." />
            </FormField>
            <FormField label="GitHub URL">
              <Input value={form.github} onChange={f('github')} placeholder="https://github.com/..." />
            </FormField>
            <FormField label="Twitter URL">
              <Input value={form.twitter} onChange={f('twitter')} placeholder="https://twitter.com/..." />
            </FormField>
            <FormField label="Personal Website">
              <Input value={form.website} onChange={f('website')} placeholder="https://yoursite.com" />
            </FormField>
          </div>

          {/* Save button */}
          <div className="flex justify-end pt-4 mt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : '💾 Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
