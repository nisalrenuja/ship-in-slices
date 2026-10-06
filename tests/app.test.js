const request = require('supertest');
const app = require('../src/app');
const tasks = require('../src/tasks');

beforeEach(() => tasks.reset());

test('creates a task', async () => {
  const res = await request(app).post('/tasks').send({ title: 'Buy tea' });
  expect(res.status).toBe(201);
  expect(res.body.title).toBe('Buy tea');
});

test('rejects a task without a title', async () => {
  const res = await request(app).post('/tasks').send({});
  expect(res.status).toBe(400);
});
