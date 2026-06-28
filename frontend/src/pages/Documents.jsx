import { useState, useEffect } from 'react';
import api from '../api/client';

export default function Documents() {
  const [docs,    setDocs]    = useState([]);
  const [cards,   setCards]   = useState([]);
  const [form, setForm]       = useState({ document_name: '', email: '', account_name: '', card_number: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDocs = () => api.get('/documents').then(r => setDocs(r.data)).catch(console.error);

  useEffect(() => {
    fetchDocs();
    api.get('/cards').then(r => setCards(r.data)).catch(console.error);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await api.post('/documents', form);
      setSuccess('Sənəd uğurla yaradıldı!');
      setForm({ document_name: '', email: '', account_name: '', card_number: '' });
      fetchDocs();
    } catch (err) {
      setError(err.response?.data?.error || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const deleteDoc = async (id) => {
    if (!window.confirm('Sənədi silmək istəyirsiniz?')) return;
    try {
      await api.delete(`/documents/${id}`);
      fetchDocs();
    } catch (err) {
      alert(err.response?.data?.error || 'Xəta');
    }
  };

  return (
    <div className="page">
      <div className="section-title">📄 Sənədlər</div>

      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Create document form */}
      <div className="card">
        <div className="card-title">Yeni sənəd yarat</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Sənəd adı</label>
            <input name="document_name" value={form.document_name} onChange={handleChange}
              placeholder="məs. Hesab çıxarışı" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="email@example.com" required />
          </div>
          <div className="form-group">
            <label>Hesab adı</label>
            <input name="account_name" value={form.account_name} onChange={handleChange}
              placeholder="Ad Soyad" required />
          </div>
          <div className="form-group">
            <label>Kart nömrəsi (ixtiyari)</label>
            <select name="card_number" value={form.card_number} onChange={handleChange}>
              <option value="">Seçin...</option>
              {cards.map(c => (
                <option key={c.id} value={c.card_number}>{c.card_number}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Yaradılır...' : 'Yarat'}
          </button>
        </form>
      </div>

      <div className="divider" />
      <div className="section-title">Sənəd siyahısı</div>

      {docs.length === 0 ? (
        <div className="empty-state"><p>Hələ ki sənəd yoxdur</p></div>
      ) : (
        docs.map(doc => (
          <div key={doc.id} className="card" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>📄 {doc.document_name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{doc.account_name} · {doc.email}</div>
                {doc.card_number && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{doc.card_number}</div>}
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{doc.date}</div>
              </div>
              <button className="btn btn-sm" onClick={() => deleteDoc(doc.id)}
                style={{ background: '#fee2e2', color: 'var(--danger)', border: 'none' }}>
                🗑
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
