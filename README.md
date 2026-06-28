# 🏦 Leo Bank — Full Stack App

React + Node.js + Express + SQLite

---

## Quraşdırma

### 1. Backend

```bash
cd backend
npm install
npm start
```

Server `http://localhost:5000` ünvanında işə düşür.
İlk işə salındıqda avtomatik demo istifadəçi yaradılır:
- **Username:** `demo`
- **Şifrə:** `demo123`

---

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Tətbiq `http://localhost:3000` ünvanında açılır.

---

## API Endpointləri

| Method | URL                        | Açıqlama               | Auth |
|--------|----------------------------|------------------------|------|
| POST   | /api/auth/login            | Daxil ol               | ❌    |
| POST   | /api/auth/reset-password   | Şifrəni yenilə         | ❌    |
| POST   | /api/auth/logout           | Çıxış                  | ✅    |
| GET    | /api/profile               | Profilə bax            | ✅    |
| PUT    | /api/profile               | Profili yenilə         | ✅    |
| GET    | /api/account               | Balansı gör            | ✅    |
| GET    | /api/cards                 | Kartları gör           | ✅    |
| POST   | /api/cards                 | Kart əlavə et          | ✅    |
| DELETE | /api/cards/:id             | Kart sil               | ✅    |
| GET    | /api/payments              | Ödəniş tarixçəsi       | ✅    |
| POST   | /api/payments              | Ödəniş et              | ✅    |
| GET    | /api/transactions          | Köçürmə tarixçəsi      | ✅    |
| POST   | /api/transactions          | Pul köçür              | ✅    |
| GET    | /api/documents             | Sənəd siyahısı         | ✅    |
| POST   | /api/documents             | Sənəd yarat            | ✅    |
| DELETE | /api/documents/:id         | Sənəd sil              | ✅    |

Auth ✅ — `Authorization: Bearer <token>` header tələb olunur.

---

## Database Cədvəlləri

| Cədvəl       | Sahələr                                                      |
|--------------|--------------------------------------------------------------|
| profil       | id, username, first_name, last_name, password, email, phone, birthday |
| account      | id, user_id, balance                                         |
| cards        | id, user_id, card_number, expire_date, cvv, card_type, contract_name |
| payments     | id, user_id, price, date, type, name                         |
| transactions | id, user_id, from_card, to_card, date, price                 |
| documents    | id, user_id, document_name, date, email, account_name, card_number |

---

## Layihə Strukturu

```
leo-bank/
├── backend/
│   ├── index.js          ← Express server
│   ├── db.js             ← SQLite + cədvəllər + seed data
│   ├── middleware/
│   │   └── auth.js       ← JWT yoxlama
│   └── routes/
│       ├── auth.js
│       ├── profile.js
│       ├── account.js
│       ├── cards.js
│       ├── payments.js
│       ├── transactions.js
│       └── documents.js
└── frontend/
    └── src/
        ├── App.jsx
        ├── styles.css
        ├── api/client.js
        ├── components/Navbar.jsx
        └── pages/
            ├── Login.jsx
            ├── ResetPassword.jsx
            ├── Home.jsx
            ├── Payment.jsx
            ├── TopUp.jsx
            ├── Products.jsx
            ├── Documents.jsx
            └── Profile.jsx
```
