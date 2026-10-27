import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../utils/api';
import { AdminPageHeader, ActionButtons, Modal, ConfirmDelete, FormField, Input, Textarea, Select, Toggle, FileInput } from '../../components/admin/AdminComponents';

const EMPTY = {
  title: '', slug: '', tagline: '', category: '', industry: '', duration: '',
  teamSize: '', role: '', problem: '', analysis: '', strategy: '', result: '',
  tools: '', frameworks: '', tags: '', isFeatured: false, isVisible: true, order: 0,
};

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [metricsText, setMetricsText] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetch = async () => {
    setLoading(true);
    const { data } = await API.get('/projects').finally(() => setLoading(false));
    setItems(data.data || []);
  };
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setMetricsText(''); setFile(null); setPreview(''); setModal(true); };
  const openEdit = (item) => {
    setEditing(item._id);
    setForm({ ...item, tools: (item.tools || []).join(', '), frameworks: (item.frameworks || []).join(', '), tags: (item.tags || []).join(', ') });
    setMetricsText(JSON.stringify(item.metrics || [], null, 2));
    setPreview(item.coverImage?.url || '');
    setFile(null);
    setModal(true);
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const fCheck = (k) => (e) => setForm({ ...form, [k]: e.target.checked });

  const handleSave = async () => {
    if (!form.title) return toast.error('Title is required');
    setSaving(true);
    try {
      const fd = new FormData();
      const payload = {
        ...form,
        metrics: metricsText || '[]',
        tools: JSON.stringify(form.tools.split(',').map((s) => s.trim()).filter(Boolean)),
        frameworks: JSON.stringify(form.frameworks.split(',').map((s) => s.trim()).filter(Boolean)),
        tags: JSON.stringify(form.tags.split(',').map((s) => s.trim()).filter(Boolean)),
      };
      Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('coverImage', file);

      if (editing) { await API.put(`/projects/${editing}`, fd); toast.success('Project updated'); }
      else { await API.post('/projects', fd); toast.success('Project created'); }
      setModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const doDelete = async () => {
    try { await API.delete(`/projects/${confirmDelete.id}`); toast.success('Deleted'); setConfirmDelete(null); fetch(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <AdminPageHeader title="Case Studies & Projects" subtitle="Manage your MBA project case studies" onAdd={openAdd} addLabel="Add Project" />

      {loading ? <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Loading...</div> :
        items.length === 0 ? (
          <div className="card p-12 text-center">
            <p style={{ color: 'var(--color-text-muted)' }}>No projects yet. Add your first case study.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item._id} className="card p-4 flex items-center gap-4">
                {item.coverImage?.url && (
                  <img src={item.coverImage.url} alt={item.title} style={{ width: 60, height: 45, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '0.92rem' }} className="truncate">{item.title}</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                    {[item.category, item.industry, item.role].filter(Boolean).join(' · ')}
                    {item.isFeatured && <span style={{ marginLeft: 8, color: 'var(--color-accent-hover)', fontWeight: 700 }}>⭐ Featured</span>}
                  </div>
                </div>
                <ActionButtons onEdit={() => openEdit(item)} onDelete={() => setConfirmDelete({ id: item._id, title: item.title })} />
              </div>
            ))}
          </div>
        )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Project' : 'Add Project'} size="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Project Title" required><Input value={form.title} onChange={f('title')} placeholder="Market Entry Strategy..." /></FormField>
          <FormField label="Slug" hint="Auto-generated if empty"><Input value={form.slug} onChange={f('slug')} placeholder="market-entry-strategy" /></FormField>
          <FormField label="Category"><Input value={form.category} onChange={f('category')} placeholder="Strategy, Operations, Finance..." /></FormField>
          <FormField label="Industry"><Input value={form.industry} onChange={f('industry')} placeholder="FMCG, FinTech, Healthcare..." /></FormField>
          <FormField label="Duration"><Input value={form.duration} onChange={f('duration')} placeholder="3 months" /></FormField>
          <FormField label="Team Size"><Input value={form.teamSize} onChange={f('teamSize')} placeholder="4" /></FormField>
          <FormField label="Your Role"><Input value={form.role} onChange={f('role')} placeholder="Project Lead" /></FormField>
          <FormField label="Order"><Input type="number" value={form.order} onChange={f('order')} /></FormField>
        </div>

        <FormField label="Tagline"><Input value={form.tagline} onChange={f('tagline')} placeholder="One-line summary of the project" /></FormField>

        <div className="space-y-4 my-4 p-4 rounded-lg" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '0.9rem' }}>Case Study Framework</h3>
          <FormField label="Problem Statement"><Textarea value={form.problem} onChange={f('problem')} placeholder="What business problem was being solved?" rows={3} /></FormField>
          <FormField label="Analysis & Insights"><Textarea value={form.analysis} onChange={f('analysis')} placeholder="What data and methods did you use to analyze the problem?" rows={3} /></FormField>
          <FormField label="Strategy & Approach"><Textarea value={form.strategy} onChange={f('strategy')} placeholder="What strategic recommendations did you make?" rows={3} /></FormField>
          <FormField label="Results & Impact"><Textarea value={form.result} onChange={f('result')} placeholder="What were the measurable outcomes?" rows={3} /></FormField>
        </div>

        <FormField label="Metrics (JSON)" hint='[{"label":"Revenue","value":"$5M"}]'>
          <Textarea value={metricsText} onChange={(e) => setMetricsText(e.target.value)} placeholder='[{"label": "Revenue Impact", "value": "$200M"}]' rows={3} />
        </FormField>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tools Used (comma separated)"><Input value={form.tools} onChange={f('tools')} placeholder="Excel, Python, Tableau" /></FormField>
          <FormField label="Frameworks (comma separated)"><Input value={form.frameworks} onChange={f('frameworks')} placeholder="Porter's Five Forces, BCG Matrix" /></FormField>
        </div>
        <FormField label="Tags (comma separated)"><Input value={form.tags} onChange={f('tags')} placeholder="Strategy, Market Entry, FMCG" /></FormField>
        <FormField label="Cover Image"><FileInput accept="image/*" onChange={(e) => { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} preview={preview} hint="Max 2MB" /></FormField>

        <div className="flex gap-6 my-4">
          <Toggle checked={form.isFeatured} onChange={fCheck('isFeatured')} label="Featured project" />
          <Toggle checked={form.isVisible} onChange={fCheck('isVisible')} label="Visible on portfolio" />
        </div>

        <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <button onClick={() => setModal(false)} className="btn-secondary text-sm py-2">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2">
            {saving ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </Modal>

      <ConfirmDelete open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={doDelete} item={confirmDelete?.title} />
    </div>
  );
}
