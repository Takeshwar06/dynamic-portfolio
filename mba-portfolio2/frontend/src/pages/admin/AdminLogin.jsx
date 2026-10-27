import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { login, clearError } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem',
    background: 'var(--color-bg-secondary)',
    border: '1.5px solid var(--color-border)',
    borderRadius: 8, color: 'var(--color-text-primary)',
    fontFamily: 'DM Sans, sans-serif', fontSize: '0.92rem', outline: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Lock size={24} style={{ color: 'white' }} />
          </div>
          <h1 style={{ color: 'var(--color-text-primary)', fontSize: '1.75rem', fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>Admin Login</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginTop: 4 }}>Sign in to manage your portfolio</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@portfolio.com" style={inputStyle} required />
              </div>
            </div>

            <div>
              <label style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" style={inputStyle} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center" style={{ marginTop: 8 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'var(--color-bg-secondary)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
            Default: admin@portfolio.com / Admin@123
          </div>
        </div>
      </div>
    </div>
  );
}
