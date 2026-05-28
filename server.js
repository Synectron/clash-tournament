const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

app.use(express.json());
app.use(cors());

// Simple in-memory users store for demo. In production use a real database.
let users = [
  { username: 'super', role: 'superadmin', passwordHash: bcrypt.hashSync('superpass', 10) },
  { username: 'admin', role: 'admin', passwordHash: bcrypt.hashSync('adminpass', 10) },
];

function findUser(username) {
  return users.find((u) => u.username === username);
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.slice(7);
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const user = findUser(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!bcrypt.compareSync(password, user.passwordHash)) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, user: { username: user.username, role: user.role } });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/me', authMiddleware, (req, res) => {
  const u = findUser(req.user.username);
  if (!u) return res.status(404).json({ error: 'User not found' });
  return res.json({ username: u.username, role: u.role });
});

// Create a new admin user (only superadmin)
app.post('/api/users', authMiddleware, (req, res) => {
  if (req.user.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
  const { username, password, role } = req.body || {};
  if (!username || !password || !role) return res.status(400).json({ error: 'username,password,role required' });
  if (findUser(username)) return res.status(409).json({ error: 'User exists' });
  const hash = bcrypt.hashSync(password, 10);
  users.push({ username, role, passwordHash: hash });
  return res.status(201).json({ username, role });
});
// Serve frontend build (if present) without overriding API routes.
const buildDirName = process.env.BUILD_DIR || 'dist';
const buildDir = path.join(__dirname, buildDirName);
const indexHtml = path.join(buildDir, 'index.html');

if (fs.existsSync(indexHtml)) {
  app.use(express.static(buildDir));

  // Only handle non-API GET requests and return the index.html for SPA routing.
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    return res.sendFile(indexHtml);
  });
} else {
  app.get('/', (req, res) => {
    res.send(
      `<html><body><h2>Clash Tournament API</h2><p>Frontend build not found. During development run <code>npm run dev</code> (Vite) and <code>npm run start</code> (server) in separate terminals, or build the frontend with <code>npm run build</code> then <code>npm run start</code>.</p></body></html>`
    );
  });
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
}

// generic error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
