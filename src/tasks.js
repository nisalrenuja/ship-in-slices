let items = [];
let nextId = 1;

const priorities = new Set(['low', 'medium', 'high']);

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function list({ priority, sort, order = 'asc' } = {}) {
  let result = priority ? items.filter((task) => task.priority === priority) : [...items];

  if (sort === 'dueDate') {
    result = [...result].sort((left, right) => {
      if (left.dueDate === null) return right.dueDate === null ? 0 : 1;
      if (right.dueDate === null) return -1;
      return order === 'desc'
        ? right.dueDate.localeCompare(left.dueDate)
        : left.dueDate.localeCompare(right.dueDate);
    });
  }

  return result;
}

function add({ title, priority = 'medium', dueDate = null }) {
  if (typeof title !== 'string' || title.trim() === '') {
    throw new TypeError('title is required');
  }
  if (!priorities.has(priority)) {
    throw new TypeError('priority must be low, medium, or high');
  }
  if (dueDate !== null && !isValidDate(dueDate)) {
    throw new TypeError('dueDate must be a valid date in YYYY-MM-DD format or null');
  }

  const task = { id: nextId++, title, done: false, priority, dueDate };
  items.push(task);
  return task;
}

function isPriority(value) {
  return priorities.has(value);
}

function reset() {
  items = [];
  nextId = 1;
}

module.exports = { list, add, isPriority, reset };
