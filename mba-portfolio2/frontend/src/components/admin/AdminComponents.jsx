import React from 'react';
import { Trash2, Pencil, Eye, EyeOff, Plus } from 'lucide-react';

// ─── Admin Page Header ─────────────────────────────────────────────────────────
export function AdminPageHeader({ title, subtitle, onAdd, addLabel = 'Add New' }) {
  return (
    <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
      <div>
        <h1 style={{ color: 'var(--color-text-primary)', fontSize: '1.5rem', fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginTop: 2 }}>{subtitle}</p>}
      </div>
      {onAdd && (
        <button onClick={onAdd} className="btn-primary text-sm py-2 px-4">
          <Plus size={15} /> {addLabel}
        </button>
      )}
    </div>
  );
}

// ─── Simple Card Row ───────────────────────────────────────────────────────────
export function AdminCard({ children, className = '' }) {
  return (
    <div className={`card p-5 ${className}`} style={{ marginBottom: '0.75rem' }}>
      {children}
    </div>
  );
}

// ─── Action Buttons ────────────────────────────────────────────────────────────
export function ActionButtons({ onEdit, onDelete, onToggle, isVisible }) {
  const btnBase = { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: 6, transition: 'background 0.2s' };
  return (
    <div className="flex items-center gap-1">
      {onToggle && (
        <button onClick={onToggle} style={{ ...btnBase, color: isVisible ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
          title={isVisible ? 'Hide' : 'Show'}>
          {isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
      )}
      {onEdit && (
        <button onClick={onEdit} style={{ ...btnBase, color: 'var(--color-text-secondary)' }} title="Edit">
          <Pencil size={15} />
        </button>
      )}
      {onDelete && (
        <button onClick={onDelete} style={{ ...btnBase, color: '#dc2626' }} title="Delete"
          className="hover:bg-red-50">
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}

// ─── Form Field ────────────────────────────────────────────────────────────────
export function FormField({ label, required, error, children, hint }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {label && (
        <label style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
          {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
        </label>
      )}
      {children}
      {hint && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: 4 }}>{hint}</p>}
      {error && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: 4 }}>{error}</p>}
    </div>
  );
}

// ─── Text Input ───────────────────────────────────────────────────────────────
export function Input({ value, onChange, placeholder, type = 'text', required, name, disabled }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} name={name} disabled={disabled}
      style={{
        width: '100%', padding: '0.65rem 0.9rem',
        background: 'var(--color-bg-secondary)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 7, color: 'var(--color-text-primary)',
        fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', outline: 'none',
      }} />
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea({ value, onChange, placeholder, rows = 4, name }) {
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} name={name}
      style={{
        width: '100%', padding: '0.65rem 0.9rem',
        background: 'var(--color-bg-secondary)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 7, color: 'var(--color-text-primary)',
        fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', outline: 'none', resize: 'vertical',
      }} />
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ value, onChange, children, name }) {
  return (
    <select value={value} onChange={onChange} name={name}
      style={{
        width: '100%', padding: '0.65rem 0.9rem',
        background: 'var(--color-bg-secondary)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 7, color: 'var(--color-text-primary)',
        fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', outline: 'none', cursor: 'pointer',
      }}>
      {children}
    </select>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <div style={{ position: 'relative', width: 42, height: 22 }}>
        <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 100,
          background: checked ? 'var(--color-primary)' : 'var(--color-border)',
          transition: 'background 0.2s',
        }} />
        <div style={{
          position: 'absolute', top: 2, left: checked ? 22 : 2,
          width: 18, height: 18, borderRadius: '50%',
          background: 'white', transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
      {label && <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>{label}</span>}
    </label>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  const maxW = { sm: 480, md: 600, lg: 800, xl: 1000 }[size];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem 1rem', overflowY: 'auto' }}>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: maxW, background: 'var(--color-surface)', borderRadius: 16, boxShadow: 'var(--shadow-xl)', padding: '2rem', marginTop: '2rem' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ color: 'var(--color-text-primary)', fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Playfair Display, serif' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '1rem' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Confirm Delete Dialog ─────────────────────────────────────────────────────
export function ConfirmDelete({ open, onClose, onConfirm, item }) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title="Confirm Delete" size="sm">
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Are you sure you want to delete <strong>"{item}"</strong>? This action cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-secondary text-sm py-2 px-4">Cancel</button>
        <button onClick={onConfirm} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '0.5rem 1.25rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>Delete</button>
      </div>
    </Modal>
  );
}

// ─── File Upload Input ─────────────────────────────────────────────────────────
export function FileInput({ accept, onChange, label, preview, hint }) {
  return (
    <div>
      {label && <label style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>}
      <div style={{ border: '2px dashed var(--color-border)', borderRadius: 8, padding: '1rem', textAlign: 'center', background: 'var(--color-bg-secondary)', cursor: 'pointer', position: 'relative' }}>
        <input type="file" accept={accept} onChange={onChange}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
        {preview ? (
          <img src={preview} alt="Preview" style={{ maxHeight: 80, maxWidth: '100%', borderRadius: 6, objectFit: 'contain', margin: '0 auto' }} />
        ) : (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>Click or drag to upload {label}</p>
        )}
      </div>
      {hint && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', marginTop: 4 }}>{hint}</p>}
    </div>
  );
}
