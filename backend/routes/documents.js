const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/documents  — sənəd siyahısı
router.get('/', authMiddleware, (req, res) => {
  const docs = db.prepare(
    'SELECT * FROM documents WHERE user_id = ? ORDER BY date DESC'
  ).all(req.user.id);
  res.json(docs);
});

// POST /api/documents  — yeni sənəd yarat
router.post('/', authMiddleware, (req, res) => {
  const { document_name, email, account_name, card_number } = req.body;

  if (!document_name || !email || !account_name) {
    return res.status(400).json({ error: 'Sənəd adı, email və hesab adı tələb olunur' });
  }

  const result = db.prepare(`
    INSERT INTO documents (user_id, document_name, date, email, account_name, card_number)
    VALUES (?, ?, date('now'), ?, ?, ?)
  `).run(req.user.id, document_name, email, account_name, card_number || null);

  res.status(201).json({ id: result.lastInsertRowid, message: 'Sənəd yaradıldı' });
});

// DELETE /api/documents/:id
router.delete('/:id', authMiddleware, (req, res) => {
  const doc = db.prepare('SELECT id FROM documents WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!doc) return res.status(404).json({ error: 'Sənəd tapılmadı' });

  db.prepare('DELETE FROM documents WHERE id = ?').run(req.params.id);
  res.json({ message: 'Sənəd silindi' });
});

module.exports = router;
