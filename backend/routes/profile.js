const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/profile  — öz profilini gör
router.get('/', authMiddleware, (req, res) => {
  const user = db.prepare(
    'SELECT id, username, first_name, last_name, email, phone, birthday FROM profil WHERE id = ?'
  ).get(req.user.id);

  if (!user) return res.status(404).json({ error: 'İstifadəçi tapılmadı' });
  res.json(user);
});

// PUT /api/profile  — profili yenilə
router.put('/', authMiddleware, (req, res) => {
  const { first_name, last_name, email, phone, birthday } = req.body;

  db.prepare(`
    UPDATE profil
    SET first_name = ?, last_name = ?, email = ?, phone = ?, birthday = ?
    WHERE id = ?
  `).run(first_name, last_name, email, phone, birthday, req.user.id);

  res.json({ message: 'Profil yeniləndi' });
});

module.exports = router;
