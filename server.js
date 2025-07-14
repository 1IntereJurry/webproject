const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

const USERS_PATH = './users.json';

// Hilfsfunktion: Benutzer speichern
function saveUsers(users) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

// Benutzer laden
function loadUsers() {
  if (!fs.existsSync(USERS_PATH)) return {};
  return JSON.parse(fs.readFileSync(USERS_PATH));
}

// Registrierung
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  if (users[email]) {
    return res.send('⚠️ Diese E-Mail ist bereits registriert.');
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
    return res.send('🔐 Account nicht gefunden. Prüfe E-Mail & Passwort.');
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (match) {
    res.send('🎉 Login erfolgreich! Willkommen zurück.');
  } else {
    res.send('❌ Falsches Passwort oder E-Mail.');
  }
});

app.listen(3000, () => console.log('🌍 Server läuft auf http://localhost:3000'));
