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

test('creates a task with priority and due date', async () => {
  const res = await request(app).post('/tasks').send({
    title: 'Ship feature',
    priority: 'high',
    dueDate: '2026-12-01'
  });
  expect(res.status).toBe(201);
  expect(res.body).toMatchObject({ priority: 'high', dueDate: '2026-12-01' });
});

test.each([
  [{ title: 'Ship feature', priority: 'urgent' }, 'priority must be low, medium, or high'],
  [{ title: 'Ship feature', dueDate: '2026-02-30' }, 'dueDate must be a valid YYYY-MM-DD date']
])('rejects invalid task metadata', async (body, error) => {
  const res = await request(app).post('/tasks').send(body);
  expect(res.status).toBe(400);
  expect(res.body).toEqual({ error });
});

test('filters tasks by priority', async () => {
  tasks.add('Urgent', { priority: 'high' });
  tasks.add('Later', { priority: 'low' });

  const res = await request(app).get('/tasks?priority=high');

  expect(res.status).toBe(200);
  expect(res.body.map(task => task.title)).toEqual(['Urgent']);
});

test('sorts tasks by due date with undated tasks last', async () => {
  tasks.add('Undated');
  tasks.add('Later', { dueDate: '2026-12-01' });
  tasks.add('Sooner', { dueDate: '2026-10-01' });

  const res = await request(app).get('/tasks?sort=dueDate');

  expect(res.status).toBe(200);
  expect(res.body.map(task => task.title)).toEqual(['Sooner', 'Later', 'Undated']);
});

test('sorts tasks descending and keeps undated tasks last', async () => {
  tasks.add('Undated');
  tasks.add('Sooner', { dueDate: '2026-10-01' });
  tasks.add('Later', { dueDate: '2026-12-01' });

  const res = await request(app).get('/tasks?sort=dueDate&order=desc');

  expect(res.status).toBe(200);
  expect(res.body.map(task => task.title)).toEqual(['Later', 'Sooner', 'Undated']);
});

test('combines priority filtering with due-date sorting', async () => {
  tasks.add('Low priority sooner', { priority: 'low', dueDate: '2026-10-01' });
  tasks.add('High priority later', { priority: 'high', dueDate: '2026-12-01' });
  tasks.add('High priority sooner', { priority: 'high', dueDate: '2026-10-01' });

  const res = await request(app).get('/tasks?priority=high&sort=dueDate');

  expect(res.status).toBe(200);
  expect(res.body.map(task => task.title)).toEqual(['High priority sooner', 'High priority later']);
});

test.each([
  ['/tasks?priority=urgent', 'priority must be low, medium, or high'],
  ['/tasks?sort=title', 'sort must be dueDate'],
  ['/tasks?sort=dueDate&order=sideways', 'order must be asc or desc'],
  ['/tasks?order=desc', 'order requires sort=dueDate']
])('rejects invalid task-list query %s', async (path, error) => {
  const res = await request(app).get(path);
  expect(res.status).toBe(400);
  expect(res.body).toEqual({ error });
});

test('serves the task UI with task creation and list controls', async () => {
  const res = await request(app).get('/');

  expect(res.status).toBe(200);
  expect(res.type).toBe('text/html');
  expect(res.text).toContain('id="task-form"');
  expect(res.text).toContain('name="dueDate"');
  expect(res.text).toContain('id="priority-filter"');
  expect(res.text).toContain('id="due-date-order"');
});
