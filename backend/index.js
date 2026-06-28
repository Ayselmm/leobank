const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/profile',      require('./routes/profile'));
app.use('/api/account',      require('./routes/account'));
app.use('/api/cards',        require('./routes/cards'));
app.use('/api/payments',     require('./routes/payments'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/documents',    require('./routes/documents'));

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', app: 'Leo Bank API' }));

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Endpoint tapılmadı' }));

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server xətası' });
});

app.listen(PORT, () => {
  console.log(`🏦 Leo Bank API → http://localhost:${PORT}`);
});
