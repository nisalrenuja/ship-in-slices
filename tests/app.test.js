const request = require('supertest');
const app = require('../src/app');
const tasks = require('../src/tasks');

beforeEach(() => tasks.reset());

test('creates a task', async () => {
  const res = await request(app).post('/tasks').send({ title: 'Buy tea' });
  expect(res.status).toBe(201);
  expect(res.body.title).toBe('Buy tea');
  expect(res.body.priority).toBe('medium');
  expect(res.body.dueDate).toBeNull();
});

test('rejects a task without a title', async () => {
  const res = await request(app).post('/tasks').send({});
  expect(res.status).toBe(400);
});

test.each(['low', 'medium', 'high'])('creates a task with %s priority and a due date', async (priority) => {
  const res = await request(app)
    .post('/tasks')
    .send({ title: 'Ship feature', priority, dueDate: '2026-10-31' });

  expect(res.status).toBe(201);
  expect(res.body).toMatchObject({ priority, dueDate: '2026-10-31' });
});

test.each([
  [{ title: 'Task', priority: 'urgent' }, 'priority must be low, medium, or high'],
  [{ title: 'Task', dueDate: '2026-02-30' }, 'dueDate must be a valid date in YYYY-MM-DD format or null'],
  [{ title: 'Task', dueDate: '10/31/2026' }, 'dueDate must be a valid date in YYYY-MM-DD format or null'],
])('rejects invalid task data', async (body, error) => {
  const res = await request(app).post('/tasks').send(body);

  expect(res.status).toBe(400);
  expect(res.body.error).toBe(error);
  expect(tasks.list()).toHaveLength(0);
});

test('filters tasks by priority', async () => {
  await request(app).post('/tasks').send({ title: 'Low task', priority: 'low' });
  await request(app).post('/tasks').send({ title: 'High task', priority: 'high' });

  const res = await request(app).get('/tasks?priority=high');

  expect(res.status).toBe(200);
  expect(res.body.map((task) => task.title)).toEqual(['High task']);
});

test('rejects an invalid priority filter', async () => {
  const res = await request(app).get('/tasks?priority=urgent');

  expect(res.status).toBe(400);
  expect(res.body.error).toMatch(/priority/);
});

test('sorts tasks by due date with undated tasks last', async () => {
  await request(app).post('/tasks').send({ title: 'Later', dueDate: '2026-12-01' });
  await request(app).post('/tasks').send({ title: 'Undated' });
  await request(app).post('/tasks').send({ title: 'Sooner', dueDate: '2026-10-01' });

  const ascending = await request(app).get('/tasks?sort=dueDate');
  const descending = await request(app).get('/tasks?sort=dueDate&order=desc');

  expect(ascending.body.map((task) => task.title)).toEqual(['Sooner', 'Later', 'Undated']);
  expect(descending.body.map((task) => task.title)).toEqual(['Later', 'Sooner', 'Undated']);
});

test('rejects unsupported sort options', async () => {
  const res = await request(app).get('/tasks?sort=title');

  expect(res.status).toBe(400);
  expect(res.body.error).toMatch(/sort/);
});

test('rejects unsupported sort order', async () => {
  const res = await request(app).get('/tasks?sort=dueDate&order=random');

  expect(res.status).toBe(400);
  expect(res.body.error).toMatch(/order/);
});

test('serves the task list page', async () => {
  const res = await request(app).get('/');

  expect(res.status).toBe(200);
  expect(res.text).toContain('id="tasks"');
  expect(res.text).toContain('priority');
});
