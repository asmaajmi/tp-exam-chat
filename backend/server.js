'use strict';

const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── In-memory message store ──────────────────────────────────────
// Each message: { id, author, content, timestamp }
let messages = [];
let nextId   = 1;

// ── Middleware ───────────────────────────────────────────────────
app.use(cors({
  origin: 'https://tp-exam-chat-rjeaaxbbg-asmaajmis-projects.vercel.app'
}));
app.use(express.json());                  // Parse JSON bodies

// ── Health check ─────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Mini Chat API is running 🚀' });
});

// ── GET /api/messages ─────────────────────────────────────────────
// Returns all messages sorted by timestamp (oldest first)
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

// ── POST /api/messages ────────────────────────────────────────────
// Body: { author: string, content: string }
// Returns the created message with 201
app.post('/api/messages', (req, res) => {
  const { author, content } = req.body;

  // Basic validation
  if (!author || typeof author !== 'string' || author.trim() === '') {
    return res.status(400).json({ error: 'Le champ "author" est requis.' });
  }
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'Le champ "content" est requis.' });
  }

  const message = {
    id:        nextId++,
    author:    author.trim().slice(0, 50),
    content:   content.trim().slice(0, 500),
    timestamp: Date.now(),
  };

  messages.push(message);

  res.status(201).json(message);
});

// ── DELETE /api/messages (bonus: clear all) ───────────────────────
app.delete('/api/messages', (req, res) => {
  messages = [];
  nextId   = 1;
  res.json({ message: 'Tous les messages ont été supprimés.' });
});

// ── Start server ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Mini Chat API listening on port ${PORT}`);
});

// Export for testing
module.exports = app;
