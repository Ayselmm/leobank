import { useState } from 'react';
import api from '../api/client';

const PAYMENT_TYPES = [
  { value: 'utility',  label: '💡 Kommunal (İşıq, Qaz, Su)' },
  { value: 'mobile',   label: '📱 Mobil operator' },
  { value: 'internet', label: '🌐 İnternet' },
  { value: 'transfer', label: '🏦 Bank köçürməsi' },
  { value: 'shopping', label: '🛒 Alış-veriş' },
  { value: 'other',    label: '📦 Digər' },
];

export default function Payment() {
  const [form, setForm]       = useState({ name: '', price: '', type: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await api.post('/payments', { ...form, price: parseFloat(form.price) });
      setSuccess('Ödəniş uğurla icra edildi!');
      setForm({ name: '', price: '', type: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="section-title">💳 Ödəniş et</div>

      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ödəniş növü</label>
            <select name="type" value={form.type} onChange={handleChange} required>
              <option value="">Seçin...</option>
              {PAYMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Ödəniş adı / Alıcı</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="məs. Azərenerji, Bakcell..."
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
            {loading ? 'Gözləyin...' : 'Ödə'}
          </button>
        </form>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
        Ödəniş balansınızdan çıxılacaq
      </p>
    </div>
  );
}
