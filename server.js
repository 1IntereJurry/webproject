const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'sichere-geheime-session123',
  resave: false,
  saveUninitialized: false
}));

// User-Daten werden lokal in JSON-Datei gespeichert
const USERS_FILE = path.join(__dirname, 'users.json');

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return {};
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Registrierung
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  if (users[email]) {
    return res.send('⚠️ Diese E-Mail ist bereits registriert.');
  }

  const hashed = await bcrypt.hash(password, 10);
  users[email] = { email, passwordHash: hashed };
  saveUsers(users);
  res.send('✅ Registrierung erfolgreich!');
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();
  const user = users[email];

  if (!user) {
    return res.send('❌ Kein Benutzer gefunden.');
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (match) {
    req.session.user = email;
    res.redirect('/profil');
  } else {
    res.send('❌ Passwort ist falsch.');
  }
});

// Geschützte Profilseite
app.get('/profil', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login.html');
  }

  res.send(`
    <h1>👋 Willkommen, ${req.session.user}</h1>
    <p>Dies ist deine persönliche Profilseite.</p>
    <form method="POST" action="/logout">
      <button>Logout</button>
    </form>
  `);
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Start
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});