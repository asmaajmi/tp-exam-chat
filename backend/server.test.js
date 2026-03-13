'use strict';

const request = require('supertest');
const app     = require('./server');

describe('Mini Chat API', () => {

  // ── GET /api/messages ─────────────────────────────────────────
  describe('GET /api/messages', () => {
    it('should return 200 and an array', async () => {
      const res = await request(app).get('/api/messages');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ── POST /api/messages ────────────────────────────────────────
  describe('POST /api/messages', () => {
    it('should create a message and return 201', async () => {
      const res = await request(app)
        .post('/api/messages')
        .send({ author: 'Alice', content: 'Hello DevOps!' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        author:  'Alice',
        content: 'Hello DevOps!',
      });
      expect(res.body.id).toBeDefined();
      expect(res.body.timestamp).toBeDefined();
    });

    it('should return 400 if author is missing', async () => {
      const res = await request(app)
        .post('/api/messages')
        .send({ content: 'No author!' });
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 if content is missing', async () => {
      const res = await request(app)
        .post('/api/messages')
        .send({ author: 'Bob' });
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 if body is empty', async () => {
      const res = await request(app)
        .post('/api/messages')
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });

  // ── GET after POST ────────────────────────────────────────────
  describe('Message persistence in memory', () => {
    it('should list the previously created message', async () => {
      await request(app)
        .post('/api/messages')
        .send({ author: 'Charlie', content: 'Persistance OK' });

      const res = await request(app).get('/api/messages');
      const found = res.body.some(
        m => m.author === 'Charlie' && m.content === 'Persistance OK'
      );
      expect(found).toBe(true);
    });
  });

  // ── Health check ──────────────────────────────────────────────
  describe('GET /', () => {
    it('should return status ok', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

});