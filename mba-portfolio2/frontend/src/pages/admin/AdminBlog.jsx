// ── ADMIN BLOG ────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../utils/api';
import { AdminPageHeader, ActionButtons, Modal, ConfirmDelete, FormField, Input, Textarea, Toggle, FileInput } from '../../components/admin/AdminComponents';

const EMPTY_BLOG = { title: '', slug: '', excerpt: '', content: '', category: '', tags: '', readTime: 5, isPublished: false, isFeatured: false };

export function AdminBlog() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_BLOG);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetch = () => API.get('/blogs').then((r) => setItems(r.data.data || []));
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_BLOG); setFile(null); setPreview(''); setModal(true); };
  const openEdit = (item) => { setEditing(item._id); setForm({ ...item, tags: (item.tags || []).join(', ') }); setPreview(item.coverImage?.url || ''); setFile(null); setModal(true); };
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const fBool = (k) => (e) => setForm({ ...form, [k]: e.target.checked });

  const handleSave = async () => {
    if (!form.title) return toast.error('Title is required');
    setSaving(true);
    try {
      const fd = new FormData();
      const payload = { ...form, tags: JSON.stringify(form.tags.split(',').map((s) => s.trim()).filter(Boolean)) };
      Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('coverImage', file);
      if (editing) { await API.put(`/blogs/${editing}`, fd); toast.success('Blog updated'); }
      else { await API.post('/blogs', fd); toast.success('Blog created'); }
      setModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <AdminPageHeader title="Blog & Insights" subtitle="Manage your business insights and articles" onAdd={openAdd} addLabel="Write Article" />
      <div className="space-y-3">
        {items.map((blog) => (
          <div key={blog._id} className="card p-4 flex items-center gap-4">
            {blog.coverImage?.url && <img src={blog.coverImage.url} alt={blog.title} style={{ width: 60, height: 45, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '0.9rem' }} className="truncate">{blog.title}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                {blog.category} · {blog.readTime} min read
                {blog.isPublished ? <span style={{ color: '#059669', marginLeft: 8, fontWeight: 600 }}>● Published</span> : <span style={{ color: '#d97706', marginLeft: 8, fontWeight: 600 }}>● Draft</span>}
                {blog.isFeatured && <span style={{ color: 'var(--color-accent-hover)', marginLeft: 8 }}>⭐</span>}
              </div>
            </div>
            <ActionButtons onEdit={() => openEdit(blog)} onDelete={() => setConfirmDelete({ id: blog._id, title: blog.title })} />
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Blog Post' : 'New Blog Post'} size="xl">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Title" required><Input value={form.title} onChange={f('title')} placeholder="Article title" /></FormField>
          <FormField label="Category"><Input value={form.category} onChange={f('category')} placeholder="Strategy, Operations..." /></FormField>
          <FormField label="Slug" hint="Auto-generated if empty"><Input value={form.slug} onChange={f('slug')} placeholder="article-slug" /></FormField>
          <FormField label="Read Time (min)"><Input type="number" value={form.readTime} onChange={f('readTime')} /></FormField>
        </div>
        <FormField label="Tags (comma separated)"><Input value={form.tags} onChange={f('tags')} placeholder="Strategy, Markets, Finance" /></FormField>
        <FormField label="Excerpt"><Textarea value={form.excerpt} onChange={f('excerpt')} placeholder="Brief summary shown in listing" rows={2} /></FormField>
        <FormField label="Full Content"><Textarea value={form.content} onChange={f('content')} placeholder="Full article content (HTML supported)" rows={10} /></FormField>
        <FormField label="Cover Image"><FileInput accept="image/*" onChange={(e) => { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} preview={preview} hint="Max 2MB" /></FormField>
        <div className="flex gap-6 my-4">
          <Toggle checked={form.isPublished} onChange={fBool('isPublished')} label="Publish article" />
          <Toggle checked={form.isFeatured} onChange={fBool('isFeatured')} label="Feature this article" />
        </div>
        <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <button onClick={() => setModal(false)} className="btn-secondary text-sm py-2">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2">{saving ? 'Saving...' : editing ? 'Update' : 'Publish'}</button>
        </div>
      </Modal>
      <ConfirmDelete open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={async () => { await API.delete(`/blogs/${confirmDelete.id}`); toast.success('Deleted'); setConfirmDelete(null); fetch(); }} item={confirmDelete?.title} />
    </div>
  );
}

export default AdminBlog;
