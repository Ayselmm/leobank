import { useState, useEffect } from 'react';
import api from '../api/client';

export default function Home() {
  const user = JSON.parse(localStorage.getItem('leo_user') || '{}');
  const [account,  setAccount]  = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/account'),
      api.get('/payments'),
    ]).then(([accRes, payRes]) => {
      setAccount(accRes.data);
      setPayments(payRes.data.slice(0, 10));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Yüklənir...</div>;

  const typeBadge = (type) => {
    const map = { utility: 'badge-blue', mobile: 'badge-green', transfer: 'badge-purple' };
    return map[type] || 'badge-gray';
  };

  return (
    <div className="page">
      {/* Greeting */}
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Xoş gəldiniz 👋</p>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        {user.first_name} {user.last_name}
      </h2>

      {/* Balance */}
      <div className="balance-hero">
        <div className="label">Cari Balans</div>
        <div className="amount">
          <span>₼</span>
          {account ? account.balance.toFixed(2) : '—'}
        </div>
      </div>

      {/* Transaction history */}
      <div className="section-title">Son əməliyyatlar</div>

      {payments.length === 0 ? (
        <div className="empty-state">
          <p>Hələ ki əməliyyat yoxdur</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Ad</th>
                <th>Məbləğ</th>
                <th>Tip</th>
                <th>Tarix</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td style={{ color: 'var(--danger)', fontWeight: 600 }}>−₼{p.price?.toFixed(2)}</td>
                  <td><span className={`badge ${typeBadge(p.type)}`}>{p.type}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
