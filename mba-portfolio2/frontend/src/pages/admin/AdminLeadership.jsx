import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../utils/api';
import { AdminPageHeader, ActionButtons, Modal, ConfirmDelete, FormField, Input, Textarea, Toggle, FileInput } from '../../components/admin/AdminComponents';

const EMPTY = { title: '', organization: '', role: '', startDate: '', endDate: '', isCurrent: false, description: '', achievements: '', order: 0, isVisible: true };

export default function AdminLeadership() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetch = () => API.get('/leadership').then((r) => setItems(r.data.data || []));
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setFile(null); setPreview(''); setModal(true); };
  const openEdit = (item) => {
    setEditing(item._id);
    setForm({ ...item, startDate: item.startDate ? item.startDate.slice(0, 10) : '', endDate: item.endDate ? item.endDate.slice(0, 10) : '', achievements: (item.achievements || []).join('\n') });
    setPreview(item.image?.url || ''); setFile(null); setModal(true);
  };
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSave = async () => {
    if (!form.title || !form.organization) return toast.error('Title and organization required');
    setSaving(true);
    try {
      const fd = new FormData();
      const payload = { ...form, achievements: JSON.stringify(form.achievements.split('\n').filter(Boolean)) };
      Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('image', file);
      if (editing) { await API.put(`/leadership/${editing}`, fd); toast.success('Updated'); }
      else { await API.post('/leadership', fd); toast.success('Created'); }
      setModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <AdminPageHeader title="Leadership & Activities" onAdd={openAdd} addLabel="Add Activity" />
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="card p-4 flex items-center gap-4">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>{item.title}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{item.organization} {item.isCurrent && '· Active'}</div>
            </div>
            <ActionButtons onEdit={() => openEdit(item)} onDelete={() => setConfirmDelete({ id: item._id, title: item.title })} />
          </div>
        ))}
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Activity' : 'Add Activity'} size="md">
        <FormField label="Title" required><Input value={form.title} onChange={f('title')} placeholder="VP, Consulting Club" /></FormField>
        <FormField label="Organization" required><Input value={form.organization} onChange={f('organization')} placeholder="IIM Ahmedabad" /></FormField>
        <FormField label="Your Role"><Input value={form.role} onChange={f('role')} placeholder="Vice President" /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Date"><Input type="date" value={form.startDate} onChange={f('startDate')} /></FormField>
          <FormField label="End Date"><Input type="date" value={form.endDate} onChange={f('endDate')} disabled={form.isCurrent} /></FormField>
        </div>
        <Toggle checked={form.isCurrent} onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })} label="Currently active" />
        <div className="mt-4">
          <FormField label="Description"><Textarea value={form.description} onChange={f('description')} rows={3} /></FormField>
          <FormField label="Achievements" hint="One per line"><Textarea value={form.achievements} onChange={f('achievements')} rows={4} /></FormField>
        </div>
        <FormField label="Image"><FileInput accept="image/*" onChange={(e) => { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} preview={preview} /></FormField>
        <div className="flex justify-end gap-3 pt-4 mt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <button onClick={() => setModal(false)} className="btn-secondary text-sm py-2">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2">{saving ? 'Saving...' : editing ? 'Update' : 'Add'}</button>
        </div>
      </Modal>
      <ConfirmDelete open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={async () => { await API.delete(`/leadership/${confirmDelete.id}`); toast.success('Deleted'); setConfirmDelete(null); fetch(); }} item={confirmDelete?.title} />
    </div>
  );
}
