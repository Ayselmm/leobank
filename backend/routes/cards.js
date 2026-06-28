const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/cards  — bütün kartlar
router.get('/', authMiddleware, (req, res) => {
  const cards = db.prepare('SELECT * FROM cards WHERE user_id = ?').all(req.user.id);
  res.json(cards);
});

// POST /api/cards  — yeni kart əlavə et
router.post('/', authMiddleware, (req, res) => {
  const { card_number, expire_date, cvv, card_type, contract_name } = req.body;

  if (!card_number || !expire_date || !cvv) {
    return res.status(400).json({ error: 'Kart nömrəsi, tarix və CVV tələb olunur' });
  }

  const type = card_type || 'debit';

  const result = db.prepare(`
    INSERT INTO cards (user_id, card_number, expire_date, cvv, card_type, contract_name)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(req.user.id, card_number, expire_date, cvv, type, contract_name || null);

  res.status(201).json({ id: result.lastInsertRowid, message: 'Kart əlavə edildi' });
});

// DELETE /api/cards/:id  — kart sil
router.delete('/:id', authMiddleware, (req, res) => {
  const card = db.prepare('SELECT id FROM cards WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!card) return res.status(404).json({ error: 'Kart tapılmadı' });

  db.prepare('DELETE FROM cards WHERE id = ?').run(req.params.id);
  res.json({ message: 'Kart silindi' });
});

module.exports = router;
