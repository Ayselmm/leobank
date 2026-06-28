import { useState, useEffect } from 'react';
import api from '../api/client';

function CardVisual({ card }) {
  const isCredit = card.card_type === 'credit';
  return (
    <div className={`bank-card-visual ${isCredit ? 'credit' : ''}`}>
      <div className="card-type-badge">{isCredit ? 'Kredit' : 'Debet'}</div>
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 12 }}>LEO BANK</div>
      <div className="card-number">{card.card_number}</div>
      <div className="card-meta">
        <span>Son tarix: {card.expire_date}</span>
        <span>CVV: ***</span>
        {isCredit && card.contract_name && <span>📄 {card.contract_name}</span>}
      </div>
    </div>
  );
}

export default function Products() {
  const [cards,   setCards]   = useState([]);
  const [tab,     setTab]     = useState('debit');  // 'debit' | 'credit'
  const [form, setForm]       = useState({ card_number: '', expire_date: '', cvv: '', contract_name: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCards = () => api.get('/cards').then(r => setCards(r.data)).catch(console.error);
  useEffect(() => { fetchCards(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await api.post('/cards', { ...form, card_type: tab });
      setSuccess('Kart əlavə edildi!');
      setForm({ card_number: '', expire_date: '', cvv: '', contract_name: '' });
      fetchCards();
    } catch (err) {
      setError(err.response?.data?.error || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (id) => {
    if (!window.confirm('Kartı silmək istəyirsiniz?')) return;
    try {
      await api.delete(`/cards/${id}`);
      fetchCards();
    } catch (err) {
      alert(err.response?.data?.error || 'Xəta');
    }
  };

  const filtered = cards.filter(c => c.card_type === tab);

  return (
    <div className="page">
      <div className="section-title">💳 Məhsullarım</div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['debit', 'credit'].map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(''); setSuccess(''); }}
            className="btn btn-sm"
            style={{
              background: tab === t ? 'var(--accent)' : 'var(--bg)',
              color: tab === t ? '#fff' : 'var(--text)',
              border: '1.5px solid var(--border)',
            }}
          >
            {t === 'debit' ? '💳 Debet kartlar' : '🟣 Kredit kartlar'}
          </button>
        ))}
      </div>

      {/* Existing cards */}
      {filtered.length === 0 ? (
        <div className="empty-state"><p>Hələ ki {tab === 'debit' ? 'debet' : 'kredit'} kart yoxdur</p></div>
      ) : (
        filtered.map(card => (
          <div key={card.id} style={{ position: 'relative' }}>
            <CardVisual card={card} />
            <button
              className="btn btn-sm"
              onClick={() => deleteCard(card.id)}
              style={{ position: 'absolute', bottom: 16, right: 12, background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none' }}
            >
              🗑 Sil
            </button>
          </div>
        ))
      )}

      <div className="divider" />

      {/* Add card form */}
      <div className="section-title">
        {tab === 'debit' ? '+ Debet kart əlavə et' : '+ Kredit kart əlavə et'}
      </div>

      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Kart nömrəsi</label>
            <input name="card_number" value={form.card_number} onChange={handleChange}
              placeholder="xxxx xxxx xxxx xxxx" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Son tarix</label>
              <input name="expire_date" value={form.expire_date} onChange={handleChange}
                placeholder="MM/YY" required />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input name="cvv" value={form.cvv} onChange={handleChange}
                placeholder="***" maxLength={4} required />
            </div>
          </div>
          {tab === 'credit' && (
            <div className="form-group">
              <label>Müqavilə adı</label>
              <input name="contract_name" value={form.contract_name} onChange={handleChange}
                placeholder="məs. Auto Kredit" />
            </div>
          )}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Gözləyin...' : 'Əlavə et'}
          </button>
        </form>
      </div>
    </div>
  );
}
