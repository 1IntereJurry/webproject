const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session({
  secret: 'geheim123',
  resave: false,
  saveUninitialized: false
}));

const USERS_PATH = './users.json';

function loadUsers() {
  return fs.existsSync(USERS_PATH) ? JSON.parse(fs.readFileSync(USERS_PATH)) : {};
}

function saveUsers(users) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

// Registrierung
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  if (users[email]) {
    return res.send('⚠️ E-Mail bereits vergeben.');
  }

  const hash = await bcrypt.hash(password, 10);
  users[email] = { email, passwordHash: hash };
  saveUsers(users);
  res.send('✅ Registrierung erfolgreich!');
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();
  const user = users[email];

  if (!user) {
    return res.send('❌ Benutzer nicht gefunden.');
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (match) {
    req.session.user = email;
    res.redirect('/profil');
  } else {
    res.send('❌ Passwort falsch.');
  }
});

// Geschützte Profilseite
app.get('/profil', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  res.send(`
    <h1>👤 Willkommen ${req.session.user}</h1>
    <p>Das ist deine persönliche Profilseite.</p>
    <form action="/logout" method="POST">
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

app.listen(3000, () => console.log('🚀 Server läuft auf Port 3000'));