import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../utils/api';
import { AdminPageHeader, ActionButtons, Modal, ConfirmDelete, FormField, Input, Textarea, Select, Toggle, FileInput } from '../../components/admin/AdminComponents';

const EMPTY = {
  title: '', company: '', location: '', type: 'Full-time',
  startDate: '', endDate: '', isCurrent: false,
  description: '', achievements: '', metrics: '', skills: '',
  order: 0, isVisible: true,
};

export default function AdminExperience() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/experiences');
      setItems(data.data || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setFile(null); setPreview(''); setModal(true); };
  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      ...item,
      startDate: item.startDate ? item.startDate.slice(0, 10) : '',
      endDate: item.endDate ? item.endDate.slice(0, 10) : '',
      achievements: (item.achievements || []).join('\n'),
      metrics: JSON.stringify(item.metrics || [], null, 2),
      skills: (item.skills || []).join(', '),
    });
    setPreview(item.logo?.url || '');
    setFile(null);
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.company) return toast.error('Title and company are required');
    setSaving(true);
    try {
      const fd = new FormData();
      const payload = {
        ...form,
        achievements: JSON.stringify(form.achievements.split('\n').filter(Boolean)),
        metrics: form.metrics || '[]',
        skills: JSON.stringify(form.skills.split(',').map((s) => s.trim()).filter(Boolean)),
      };
      Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('logo', file);

      if (editing) {
        await API.put(`/experiences/${editing}`, fd);
        toast.success('Experience updated');
      } else {
        await API.post('/experiences', fd);
        toast.success('Experience added');
      }
      setModal(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    setConfirmDelete({ id, title });
  };

  const doDelete = async () => {
    try {
      await API.delete(`/experiences/${confirmDelete.id}`);
      toast.success('Deleted');
      setConfirmDelete(null);
      fetch();
    } catch { toast.error('Delete failed'); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';

  return (
    <div>
      <AdminPageHeader title="Experience" subtitle="Manage your professional experience entries" onAdd={openAdd} addLabel="Add Experience" />

      {loading ? (
        <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '3rem' }}>Loading...</div>
      ) : items.length === 0 ? (
        <div className="card p-12 text-center">
          <p style={{ color: 'var(--color-text-muted)' }}>No experiences added yet.</p>
          <button onClick={openAdd} className="btn-primary mt-4 text-sm">Add Your First Experience</button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="card p-4 flex items-center gap-4">
              {item.logo?.url ? (
                <img src={item.logo.url} alt={item.company} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'contain', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, flexShrink: 0 }}>
                  {item.company?.charAt(0)}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '0.92rem' }}>{item.title}</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{item.company} · {fmt(item.startDate)} – {item.isCurrent ? 'Present' : fmt(item.endDate)}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!item.isVisible && <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-secondary)', padding: '2px 6px', borderRadius: 4 }}>Hidden</span>}
                <ActionButtons onEdit={() => openEdit(item)} onDelete={() => handleDelete(item._id, item.title)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Experience' : 'Add Experience'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Job Title" required>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior Strategy Analyst" />
          </FormField>
          <FormField label="Company" required>
            <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. McKinsey & Company" />
          </FormField>
          <FormField label="Location">
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Mumbai, India" />
          </FormField>
          <FormField label="Employment Type">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'].map((t) => <option key={t}>{t}</option>)}
            </Select>
          </FormField>
          <FormField label="Start Date">
            <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </FormField>
          <FormField label="End Date">
            <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={form.isCurrent} />
          </FormField>
        </div>

        <div className="flex gap-6 mb-4">
          <Toggle checked={form.isCurrent} onChange={(e) => setForm({ ...form, isCurrent: e.target.checked, endDate: '' })} label="Currently working here" />
          <Toggle checked={form.isVisible} onChange={(e) => setForm({ ...form, isVisible: e.target.checked })} label="Visible on portfolio" />
        </div>

        <FormField label="Description">
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of your role..." rows={3} />
        </FormField>
        <FormField label="Key Achievements" hint="One achievement per line">
          <Textarea value={form.achievements} onChange={(e) => setForm({ ...form, achievements: e.target.value })} placeholder="Drove 20% revenue growth&#10;Led team of 5 analysts&#10;..." rows={4} />
        </FormField>
        <FormField label="Metrics (JSON)" hint='e.g. [{"label":"Revenue","value":"$5M"}]'>
          <Textarea value={form.metrics} onChange={(e) => setForm({ ...form, metrics: e.target.value })} placeholder='[{"label": "Revenue Impact", "value": "$5M+"}]' rows={3} />
        </FormField>
        <FormField label="Skills (comma separated)">
          <Input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Strategy, Financial Modeling, Excel" />
        </FormField>
        <FormField label="Company Logo">
          <FileInput accept="image/*" onChange={(e) => { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} preview={preview} hint="Max 2MB · JPG, PNG, WebP" />
        </FormField>

        <div className="flex justify-end gap-3 mt-6 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <button onClick={() => setModal(false)} className="btn-secondary text-sm py-2">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2">
            {saving ? 'Saving...' : editing ? 'Update' : 'Add Experience'}
          </button>
        </div>
      </Modal>

      <ConfirmDelete open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={doDelete} item={confirmDelete?.title} />
    </div>
  );
}
