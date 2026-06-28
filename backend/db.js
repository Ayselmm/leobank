const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new Database(path.join(__dirname, 'leo_bank.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── CREATE TABLES ────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS profil (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    username    TEXT UNIQUE NOT NULL,
    first_name  TEXT,
    last_name   TEXT,
    password    TEXT NOT NULL,
    email       TEXT,
    phone       TEXT,
    birthday    TEXT
  );

  CREATE TABLE IF NOT EXISTS account (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    balance REAL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES profil(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS cards (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL,
    card_number   TEXT NOT NULL,
    expire_date   TEXT,
    cvv           TEXT,
    card_type     TEXT DEFAULT 'debit',
    contract_name TEXT,
    FOREIGN KEY (user_id) REFERENCES profil(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS payments (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    price   REAL,
    date    TEXT DEFAULT (date('now')),
    type    TEXT,
    name    TEXT,
    FOREIGN KEY (user_id) REFERENCES profil(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id   INTEGER NOT NULL,
    from_card TEXT,
    to_card   TEXT,
    date      TEXT DEFAULT (datetime('now')),
    price     REAL,
    FOREIGN KEY (user_id) REFERENCES profil(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS documents (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL,
    document_name TEXT,
    date          TEXT DEFAULT (date('now')),
    email         TEXT,
    account_name  TEXT,
    card_number   TEXT,
    FOREIGN KEY (user_id) REFERENCES profil(id) ON DELETE CASCADE
  );
`);

// ─── SEED DEMO USER ───────────────────────────────────────────────────────────

const existingUser = db.prepare('SELECT id FROM profil WHERE username = ?').get('demo');

if (!existingUser) {
  const hash = bcrypt.hashSync('demo123', 10);

  const insertUser = db.prepare(`
    INSERT INTO profil (username, first_name, last_name, password, email, phone, birthday)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = insertUser.run('demo', 'Aysel', 'Memmedova', hash, 'aysel@leobank.az', '+994501234567', '1995-06-15');
  const userId = result.lastInsertRowid;

  db.prepare('INSERT INTO account (user_id, balance) VALUES (?, ?)').run(userId, 2450.75);

  db.prepare(`INSERT INTO cards (user_id, card_number, expire_date, cvv, card_type) VALUES (?, ?, ?, ?, ?)`).run(userId, '4169 7388 1234 5678', '12/27', '123', 'debit');
  db.prepare(`INSERT INTO cards (user_id, card_number, expire_date, cvv, card_type, contract_name) VALUES (?, ?, ?, ?, ?, ?)`).run(userId, '5168 7500 9876 5432', '08/26', '456', 'credit', 'Auto Kredit');

  db.prepare(`INSERT INTO payments (user_id, price, date, type, name) VALUES (?, ?, ?, ?, ?)`).run(userId, 45.00, '2026-06-25', 'utility', 'Azərenerji');
  db.prepare(`INSERT INTO payments (user_id, price, date, type, name) VALUES (?, ?, ?, ?, ?)`).run(userId, 12.50, '2026-06-24', 'mobile', 'Bakcell');
  db.prepare(`INSERT INTO payments (user_id, price, date, type, name) VALUES (?, ?, ?, ?, ?)`).run(userId, 200.00, '2026-06-23', 'transfer', 'Bank köçürməsi');

  db.prepare(`INSERT INTO transactions (user_id, from_card, to_card, date, price) VALUES (?, ?, ?, ?, ?)`).run(userId, '4169 7388 1234 5678', '5168 7500 9876 5432', '2026-06-20 10:30:00', 150.00);

  db.prepare(`INSERT INTO documents (user_id, document_name, date, email, account_name, card_number) VALUES (?, ?, ?, ?, ?, ?)`).run(userId, 'Hesab çıxarışı', '2026-06-01', 'aysel@leobank.az', 'Aysel Memmedova', '4169 7388 1234 5678');

  console.log('✅ Demo user created: username=demo, password=demo123');
}

module.exports = db;
