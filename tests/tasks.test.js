const tasks = require('../src/tasks');

beforeEach(() => tasks.reset());

test('adds tasks with medium priority and no due date by default', () => {
  expect(tasks.add('Buy tea')).toEqual({
    id: 1,
    title: 'Buy tea',
    done: false,
    priority: 'medium'
  });
});

test('adds tasks with a valid priority and due date', () => {
  expect(tasks.add('Ship feature', { priority: 'high', dueDate: '2026-12-01' })).toEqual({
    id: 1,
    title: 'Ship feature',
    done: false,
    priority: 'high',
    dueDate: '2026-12-01'
  });
});

test.each(['urgent', '', null])('rejects invalid priority %p', priority => {
  expect(() => tasks.add('Buy tea', { priority })).toThrow('priority must be low, medium, or high');
});

test.each(['2026-02-30', '12/01/2026', '', null])('rejects invalid due date %p', dueDate => {
  expect(() => tasks.add('Buy tea', { dueDate })).toThrow('dueDate must be a valid YYYY-MM-DD date');
});

test('filters tasks by priority', () => {
  tasks.add('Urgent', { priority: 'high' });
  tasks.add('Later', { priority: 'low' });

  expect(tasks.list({ priority: 'high' }).map(task => task.title)).toEqual(['Urgent']);
});

test('sorts tasks by due date with undated tasks last', () => {
  tasks.add('Undated');
  tasks.add('Later', { dueDate: '2026-12-01' });
  tasks.add('Sooner', { dueDate: '2026-10-01' });

  expect(tasks.list({ sort: 'dueDate' }).map(task => task.title)).toEqual([
    'Sooner',
    'Later',
    'Undated'
  ]);
});

test('sorts by due date descending and combines sorting with filtering', () => {
  tasks.add('Low priority', { priority: 'low', dueDate: '2026-12-01' });
  tasks.add('Sooner', { priority: 'high', dueDate: '2026-10-01' });
  tasks.add('Later', { priority: 'high', dueDate: '2026-12-01' });
  tasks.add('Undated', { priority: 'high' });

  expect(tasks.list({ priority: 'high', sort: 'dueDate', order: 'desc' })
    .map(task => task.title)).toEqual(['Later', 'Sooner', 'Undated']);
});
