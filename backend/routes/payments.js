const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/payments  — ödəniş tarixçəsi
router.get('/', authMiddleware, (req, res) => {
  const payments = db.prepare(
    'SELECT * FROM payments WHERE user_id = ? ORDER BY date DESC'
  ).all(req.user.id);
  res.json(payments);
});

// POST /api/payments  — yeni ödəniş
router.post('/', authMiddleware, (req, res) => {
  const { price, type, name } = req.body;

  if (!price || !type || !name) {
    return res.status(400).json({ error: 'Məbləğ, tip və ad tələb olunur' });
  }

  // Balansdan düşür
  const account = db.prepare('SELECT * FROM account WHERE user_id = ?').get(req.user.id);
  if (!account || account.balance < price) {
    return res.status(400).json({ error: 'Balans kifayət deyil' });
  }

  const insertPayment = db.prepare(`
    INSERT INTO payments (user_id, price, type, name, date)
    VALUES (?, ?, ?, ?, date('now'))
  `);
  const updateBalance = db.prepare('UPDATE account SET balance = balance - ? WHERE user_id = ?');

  const doTransaction = db.transaction(() => {
    insertPayment.run(req.user.id, price, type, name);
    updateBalance.run(price, req.user.id);
  });

  doTransaction();
  res.status(201).json({ message: 'Ödəniş uğurla icra edildi' });
});

module.exports = router;
