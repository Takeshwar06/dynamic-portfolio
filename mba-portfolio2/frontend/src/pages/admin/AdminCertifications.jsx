import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../utils/api';
import { AdminPageHeader, ActionButtons, Modal, ConfirmDelete, FormField, Input, Textarea, Toggle, FileInput } from '../../components/admin/AdminComponents';

const EMPTY = { name: '', issuer: '', issueDate: '', credentialId: '', credentialUrl: '', description: '', order: 0, isVisible: true };

export default function AdminCertifications() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetch = () => API.get('/certifications').then((r) => setItems(r.data.data || []));
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setFile(null); setPreview(''); setModal(true); };
  const openEdit = (item) => {
    setEditing(item._id);
    setForm({ ...item, issueDate: item.issueDate ? item.issueDate.slice(0, 10) : '' });
    setPreview(item.image?.url || '');
    setFile(null);
    setModal(true);
  };
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSave = async () => {
    if (!form.name || !form.issuer) return toast.error('Name and issuer are required');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('image', file);
      if (editing) { await API.put(`/certifications/${editing}`, fd); toast.success('Updated'); }
      else { await API.post('/certifications', fd); toast.success('Created'); }
      setModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <AdminPageHeader title="Certifications" subtitle="Manage your professional certifications" onAdd={openAdd} addLabel="Add Certification" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((cert) => (
          <div key={cert._id} className="card p-4">
            <div className="flex justify-between items-start mb-2">
              <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>{cert.name}</div>
              <ActionButtons onEdit={() => openEdit(cert)} onDelete={() => setConfirmDelete({ id: cert._id, title: cert.name })} />
            </div>
            <div style={{ color: 'var(--color-primary)', fontSize: '0.82rem', fontWeight: 600 }}>{cert.issuer}</div>
            {cert.issueDate && <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>}
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Certification' : 'Add Certification'} size="md">
        <FormField label="Certification Name" required><Input value={form.name} onChange={f('name')} placeholder="e.g. CFA Level 1" /></FormField>
        <FormField label="Issuing Organization" required><Input value={form.issuer} onChange={f('issuer')} placeholder="e.g. CFA Institute" /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Issue Date"><Input type="date" value={form.issueDate} onChange={f('issueDate')} /></FormField>
          <FormField label="Credential ID"><Input value={form.credentialId} onChange={f('credentialId')} /></FormField>
        </div>
        <FormField label="Credential URL"><Input value={form.credentialUrl} onChange={f('credentialUrl')} placeholder="https://..." /></FormField>
        <FormField label="Description"><Textarea value={form.description} onChange={f('description')} rows={3} /></FormField>
        <FormField label="Badge Image"><FileInput accept="image/*" onChange={(e) => { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} preview={preview} hint="Max 2MB" /></FormField>
        <Toggle checked={form.isVisible} onChange={(e) => setForm({ ...form, isVisible: e.target.checked })} label="Visible on portfolio" />
        <div className="flex justify-end gap-3 pt-4 mt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <button onClick={() => setModal(false)} className="btn-secondary text-sm py-2">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2">{saving ? 'Saving...' : editing ? 'Update' : 'Add'}</button>
        </div>
      </Modal>
      <ConfirmDelete open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={async () => { await API.delete(`/certifications/${confirmDelete.id}`); toast.success('Deleted'); setConfirmDelete(null); fetch(); }} item={confirmDelete?.title} />
    </div>
  );
}
