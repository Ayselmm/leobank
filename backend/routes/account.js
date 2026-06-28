const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/account  — balans
router.get('/', authMiddleware, (req, res) => {
  const account = db.prepare('SELECT * FROM account WHERE user_id = ?').get(req.user.id);
  if (!account) return res.status(404).json({ error: 'Hesab tapılmadı' });
  res.json(account);
});

module.exports = router;
