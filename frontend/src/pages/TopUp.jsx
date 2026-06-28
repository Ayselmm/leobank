import { useState, useEffect } from 'react';
import api from '../api/client';

export default function TopUp() {
  const [cards,   setCards]   = useState([]);
  const [history, setHistory] = useState([]);
  const [form, setForm]       = useState({ from_card: '', to_card: '', price: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/cards').then(r => setCards(r.data)).catch(console.error);
    api.get('/transactions').then(r => setHistory(r.data)).catch(console.error);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.from_card === form.to_card) return setError('Kartlar eyni ola bilməz');
    setLoading(true);
    try {
      await api.post('/transactions', { ...form, price: parseFloat(form.price) });
      setSuccess('Köçürmə uğurla icra edildi!');
      setForm({ from_card: '', to_card: '', price: '' });
      const r = await api.get('/transactions');
      setHistory(r.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="section-title">↔ Pul köçürmə</div>

      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Göndərici kart</label>
            <select name="from_card" value={form.from_card} onChange={handleChange} required>
              <option value="">Kart seçin...</option>
              {cards.map(c => (
                <option key={c.id} value={c.card_number}>
                  {c.card_number} ({c.card_type})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Alıcı kart nömrəsi</label>
            <input
              name="to_card"
              value={form.to_card}
              onChange={handleChange}
              placeholder="xxxx xxxx xxxx xxxx"
              required
            />
          </div>

          <div className="form-group">
            <label>Məbləğ (₼)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Göndərilir...' : 'Köçür'}
          </button>
        </form>
      </div>

      {/* Transfer history */}
      {history.length > 0 && (
        <>
          <div className="section-title" style={{ marginTop: 8 }}>Köçürmə tarixçəsi</div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Haradan</th>
                  <th>Hara</th>
                  <th>₼</th>
                  <th>Tarix</th>
                </tr>
              </thead>
              <tbody>
                {history.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontSize: 11 }}>{t.from_card}</td>
                    <td style={{ fontSize: 11 }}>{t.to_card}</td>
                    <td style={{ color: 'var(--danger)', fontWeight: 600 }}>−₼{t.price?.toFixed(2)}</td>
                    <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.date?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
