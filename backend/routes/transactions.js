const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/transactions  — köçürmə tarixçəsi
router.get('/', authMiddleware, (req, res) => {
  const txns = db.prepare(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC'
  ).all(req.user.id);
  res.json(txns);
});

// POST /api/transactions  — pul köçür (top-up / transfer)
router.post('/', authMiddleware, (req, res) => {
  const { from_card, to_card, price } = req.body;

  if (!from_card || !to_card || !price) {
    return res.status(400).json({ error: 'Bütün sahələr tələb olunur' });
  }

  if (price <= 0) {
    return res.status(400).json({ error: 'Məbləğ 0-dan böyük olmalıdır' });
  }

  // Kart istifadəçiyə aid olduğunu yoxla
  const senderCard = db.prepare(
    'SELECT id FROM cards WHERE card_number = ? AND user_id = ?'
  ).get(from_card, req.user.id);

  if (!senderCard) {
    return res.status(400).json({ error: 'Göndərici kart sizə aid deyil' });
  }

  // Balansı yoxla
  const account = db.prepare('SELECT * FROM account WHERE user_id = ?').get(req.user.id);
  if (!account || account.balance < price) {
    return res.status(400).json({ error: 'Balans kifayət deyil' });
  }

  const insertTxn = db.prepare(`
    INSERT INTO transactions (user_id, from_card, to_card, date, price)
    VALUES (?, ?, ?, datetime('now'), ?)
  `);
  const updateBalance = db.prepare('UPDATE account SET balance = balance - ? WHERE user_id = ?');

  const doTransaction = db.transaction(() => {
    insertTxn.run(req.user.id, from_card, to_card, price);
    updateBalance.run(price, req.user.id);
  });

  doTransaction();
  res.status(201).json({ message: 'Köçürmə uğurla icra edildi' });
});

module.exports = router;
