import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({});
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/profile').then(r => {
      setProfile(r.data);
      setForm(r.data);
    }).catch(console.error);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await api.put('/profile', form);
      setProfile(form);
      setSuccess('Profil yeniləndi!');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('leo_token');
    localStorage.removeItem('leo_user');
    navigate('/');
  };

  if (!profile) return <div className="loading">Yüklənir...</div>;

  const fields = [
    { key: 'first_name', label: 'Ad' },
    { key: 'last_name',  label: 'Soyad' },
    { key: 'phone',      label: 'Telefon' },
    { key: 'email',      label: 'Email',  type: 'email' },
    { key: 'birthday',   label: 'Doğum tarixi', type: 'date' },
  ];

  return (
    <div className="page">
      <div className="section-title">👤 Profil</div>

      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, color: '#fff', margin: '0 auto 8px'
          }}>
            {profile.first_name?.[0]}{profile.last_name?.[0]}
          </div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{profile.first_name} {profile.last_name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>@{profile.username}</div>
        </div>

        <div className="divider" />

        {editing ? (
          <form onSubmit={handleSave}>
            {fields.map(f => (
              <div key={f.key} className="form-group">
                <label>{f.label}</label>
                <input
                  type={f.type || 'text'}
                  name={f.key}
                  value={form[f.key] || ''}
                  onChange={handleChange}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ flex: 1 }}>
                {loading ? 'Saxlanır...' : 'Saxla'}
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => setEditing(false)} style={{ flex: 1 }}>
                Ləğv et
              </button>
            </div>
          </form>
        ) : (
          <>
            {fields.map(f => (
              <div key={f.key} className="profile-field">
                <span className="pf-label">{f.label}</span>
                <span className="pf-value">{profile[f.key] || '—'}</span>
              </div>
            ))}
            <div style={{ marginTop: 16 }}>
              <button className="btn btn-secondary" onClick={() => setEditing(true)} style={{ width: '100%', marginBottom: 10 }}>
                ✏️ Redaktə et
              </button>
            </div>
          </>
        )}
      </div>

      <button className="btn btn-danger" onClick={handleLogout}>
        🚪 Çıxış
      </button>
    </div>
  );
}
