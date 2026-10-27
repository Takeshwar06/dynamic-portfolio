// ─────────────────────────────────────────────────────────────────────────────
// ADMIN CONTACTS PAGE
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Trash2, MailOpen } from 'lucide-react';
import API from '../../utils/api';
import { AdminPageHeader, Modal } from '../../components/admin/AdminComponents';

export function AdminContacts() {
  const [items, setItems] = useState([]);
  const [viewing, setViewing] = useState(null);

  const fetch = () => API.get('/contact').then((r) => setItems(r.data.data || []));
  useEffect(() => { fetch(); }, []);

  const markRead = async (id) => {
    await API.patch(`/contact/${id}/read`);
    fetch();
  };

  const deleteMsg = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    await API.delete(`/contact/${id}`);
    toast.success('Deleted');
    setViewing(null);
    fetch();
  };

  const openMsg = async (item) => {
    setViewing(item);
    if (!item.isRead) await markRead(item._id);
    fetch();
  };

  const unread = items.filter((i) => !i.isRead).length;

  return (
    <div>
      <AdminPageHeader title={`Messages ${unread > 0 ? `(${unread} unread)` : ''}`} subtitle="Contact form submissions from your portfolio" />

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <Mail size={40} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--color-text-muted)' }}>No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((msg) => (
            <div key={msg._id} onClick={() => openMsg(msg)}
              style={{
                cursor: 'pointer',
                background: msg.isRead ? 'var(--color-surface)' : 'var(--color-bg-secondary)',
                border: `1px solid ${msg.isRead ? 'var(--color-border)' : 'var(--color-primary)'}`,
                borderRadius: 10, padding: '0.9rem 1.25rem',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: msg.isRead ? 'transparent' : 'var(--color-primary)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontWeight: msg.isRead ? 500 : 700, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>{msg.name}</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{msg.email}</span>
                </div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.83rem' }} className="truncate">
                  {msg.subject && <span style={{ fontWeight: 600 }}>{msg.subject}: </span>}{msg.message}
                </div>
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', flexShrink: 0 }}>
                {new Date(msg.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Message" size="md">
        {viewing && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4 p-4 rounded-lg" style={{ background: 'var(--color-bg-secondary)' }}>
              <div><div style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>From</div><div style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{viewing.name}</div></div>
              <div><div style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>Email</div><a href={`mailto:${viewing.email}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{viewing.email}</a></div>
              {viewing.subject && <div className="col-span-2"><div style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>Subject</div><div style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{viewing.subject}</div></div>}
            </div>
            <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap', marginBottom: '1.5rem' }}>{viewing.message}</div>
            <div className="flex gap-3">
              <a href={`mailto:${viewing.email}?subject=Re: ${viewing.subject || 'Your message'}`} className="btn-primary text-sm py-2">
                <MailOpen size={14} /> Reply
              </a>
              <button onClick={() => deleteMsg(viewing._id)} style={{ background: 'none', border: '1px solid #dc2626', color: '#dc2626', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600 }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AdminContacts;
