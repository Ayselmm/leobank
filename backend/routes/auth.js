const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username və şifrə tələb olunur' });
  }

  const user = db.prepare('SELECT * FROM profil WHERE username = ?').get(username);

  if (!user) {
    return res.status(401).json({ error: 'İstifadəçi adı və ya şifrə yanlışdır' });
  }

  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'İstifadəçi adı və ya şifrə yanlışdır' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    }
  });
});

// POST /api/auth/reset-password
router.post('/reset-password', (req, res) => {
  const { username, new_password, confirm_password } = req.body;

  if (!username || !new_password || !confirm_password) {
    return res.status(400).json({ error: 'Bütün sahələr tələb olunur' });
  }

  if (new_password !== confirm_password) {
    return res.status(400).json({ error: 'Şifrələr uyğun gəlmir' });
  }

  if (new_password.length < 6) {
    return res.status(400).json({ error: 'Şifrə minimum 6 simvol olmalıdır' });
  }

  const user = db.prepare('SELECT id FROM profil WHERE username = ?').get(username);
  if (!user) {
    return res.status(404).json({ error: 'İstifadəçi tapılmadı' });
  }

  const hash = bcrypt.hashSync(new_password, 10);
  db.prepare('UPDATE profil SET password = ? WHERE username = ?').run(hash, username);

  res.json({ message: 'Şifrə uğurla yeniləndi' });
});

// POST /api/auth/logout  (client-side token silmə kifayətdir, amma endpoint təmin edirik)
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Çıxış edildi' });
});

module.exports = router;
