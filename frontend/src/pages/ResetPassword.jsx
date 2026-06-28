import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', new_password: '', confirm_password: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.new_password !== form.confirm_password) {
      return setError('Şifrələr uyğun gəlmir');
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', form);
      setSuccess('Şifrə uğurla yeniləndi! Yönləndirilirsiniz...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Leo<span>Bank</span></h1>
          <p>Şifrəni yenilə</p>
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>İstifadəçi adı</label>
            <input name="username" value={form.username} onChange={handleChange} placeholder="username" required />
          </div>
          <div className="form-group">
            <label>Yeni şifrə</label>
            <input type="password" name="new_password" value={form.new_password} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <div className="form-group">
            <label>Şifrəni təsdiqlə</label>
            <input type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Gözləyin...' : 'Yenilə'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/" style={{ color: 'var(--accent)', fontSize: 13, textDecoration: 'none' }}>
            ← Geri qayıt
          </Link>
        </div>
      </div>
    </div>
  );
}
