// ─────────────────────────────────────────────────────────────────────────────
// ADMIN SKILLS PAGE
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../utils/api';
import { AdminPageHeader, ActionButtons, Modal, ConfirmDelete, FormField, Input } from '../../components/admin/AdminComponents';

export function AdminSkills() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ category: '', items: [{ name: '', level: 80 }] });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetch = () => API.get('/skills').then((r) => setItems(r.data.data || []));
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm({ category: '', items: [{ name: '', level: 80 }] }); setModal(true); };
  const openEdit = (item) => { setEditing(item._id); setForm({ category: item.category, items: item.items || [] }); setModal(true); };
  const addSkillItem = () => setForm({ ...form, items: [...form.items, { name: '', level: 80 }] });
  const updateItem = (i, key, val) => setForm({ ...form, items: form.items.map((it, idx) => idx === i ? { ...it, [key]: val } : it) });
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });

  const handleSave = async () => {
    if (!form.category) return toast.error('Category is required');
    setSaving(true);
    try {
      const payload = { category: form.category, items: JSON.stringify(form.items) };
      if (editing) { await API.put(`/skills/${editing}`, payload); toast.success('Updated'); }
      else { await API.post('/skills', payload); toast.success('Created'); }
      setModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <AdminPageHeader title="Skills" subtitle="Manage skill categories and proficiency levels" onAdd={openAdd} addLabel="Add Category" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((cat) => (
          <div key={cat._id} className="card p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>{cat.category}</h3>
              <ActionButtons onEdit={() => openEdit(cat)} onDelete={() => setConfirmDelete({ id: cat._id, title: cat.category })} />
            </div>
            {cat.items?.map((skill, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                  <span>{skill.name}</span><span>{skill.level}%</span>
                </div>
                <div style={{ height: 5, background: 'var(--color-bg-secondary)', borderRadius: 100 }}>
                  <div style={{ width: `${skill.level}%`, height: '100%', background: 'var(--color-primary)', borderRadius: 100 }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Skills' : 'Add Skill Category'} size="md">
        <FormField label="Category Name" required>
          <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Strategic Skills" />
        </FormField>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>Skills</div>
          {form.items.map((skill, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <Input value={skill.name} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="Skill name" />
              <input type="range" min={0} max={100} value={skill.level} onChange={(e) => updateItem(i, 'level', +e.target.value)}
                style={{ width: 80, accentColor: 'var(--color-primary)' }} />
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', width: 30 }}>{skill.level}</span>
              <button onClick={() => removeItem(i)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>
          ))}
          <button onClick={addSkillItem} style={{ color: 'var(--color-primary)', background: 'none', border: '1px dashed var(--color-primary)', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: '0.82rem', marginTop: 4 }}>+ Add Skill</button>
        </div>
        <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <button onClick={() => setModal(false)} className="btn-secondary text-sm py-2">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2">{saving ? 'Saving...' : editing ? 'Update' : 'Add'}</button>
        </div>
      </Modal>
      <ConfirmDelete open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={async () => { await API.delete(`/skills/${confirmDelete.id}`); toast.success('Deleted'); setConfirmDelete(null); fetch(); }} item={confirmDelete?.title} />
    </div>
  );
}

export default AdminSkills;
