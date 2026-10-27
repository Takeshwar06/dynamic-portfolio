import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Upload, FileText, Download, Trash2 } from 'lucide-react';
import API from '../../utils/api';
import { AdminPageHeader, FormField, Input } from '../../components/admin/AdminComponents';

export default function AdminResume() {
  const [resume, setResume] = useState(null);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: 'Resume', version: '1.0' });
  const [uploading, setUploading] = useState(false);

  const fetch = () => API.get('/resume').then((r) => setResume(r.data.data));
  useEffect(() => { fetch(); }, []);

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a PDF file');
    if (file.type !== 'application/pdf') return toast.error('Only PDF files allowed');
    if (file.size > 5 * 1024 * 1024) return toast.error('File must be less than 5MB');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', form.title);
      fd.append('version', form.version);
      await API.post('/resume', fd);
      toast.success('Resume uploaded successfully!');
      setFile(null);
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const handleDelete = async () => {
    if (!resume) return;
    if (!window.confirm('Delete current resume?')) return;
    try { await API.delete(`/resume/${resume._id}`); toast.success('Deleted'); setResume(null); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <AdminPageHeader title="Resume Management" subtitle="Upload and manage your resume PDF" />

      {/* Current Resume */}
      {resume ? (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '1rem' }}>Current Resume</h2>
            <button onClick={handleDelete} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem' }}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={24} style={{ color: 'var(--color-accent-hover)' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{resume.title}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Version {resume.version} · Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}</div>
            </div>
          </div>
          <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            <iframe src={resume.file?.url} title="Resume" style={{ width: '100%', height: 500, border: 'none' }} />
          </div>
          <div className="flex gap-3 mt-4">
            <a href={resume.file?.url} target="_blank" rel="noreferrer" className="btn-primary text-sm py-2">
              <Download size={14} /> Download
            </a>
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center mb-6">
          <FileText size={40} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--color-text-muted)' }}>No resume uploaded yet.</p>
        </div>
      )}

      {/* Upload New */}
      <div className="card p-6">
        <h2 style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>
          {resume ? 'Replace Resume' : 'Upload Resume'}
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <FormField label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <FormField label="Version"><Input value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} placeholder="1.0" /></FormField>
        </div>
        <div style={{ border: '2px dashed var(--color-border)', borderRadius: 10, padding: '2rem', textAlign: 'center', background: 'var(--color-bg-secondary)', cursor: 'pointer', position: 'relative', marginBottom: '1rem' }}>
          <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
          <Upload size={28} style={{ color: 'var(--color-text-muted)', margin: '0 auto 0.5rem' }} />
          {file ? (
            <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Click to select PDF · Max 5MB</p>
          )}
        </div>
        <button onClick={handleUpload} disabled={!file || uploading} className="btn-primary">
          <Upload size={15} /> {uploading ? 'Uploading...' : 'Upload Resume'}
        </button>
      </div>
    </div>
  );
}
