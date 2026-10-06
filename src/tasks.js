let items = [];
let nextId = 1;
const priorities = new Set(['low', 'medium', 'high']);

function list({ priority, sort, order = 'asc' } = {}) {
  let result = priority ? items.filter(task => task.priority === priority) : [...items];

  if (sort === 'dueDate') {
    result = result.sort((a, b) => {
      if (!a.dueDate) return b.dueDate ? 1 : 0;
      if (!b.dueDate) return -1;
      const comparison = a.dueDate.localeCompare(b.dueDate);
      return order === 'desc' ? -comparison : comparison;
    });
  }

  return result;
}

function validateMetadata(metadata = {}) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return 'task metadata must be an object';
  }

  const { priority = 'medium', dueDate } = metadata;
  if (!priorities.has(priority)) {
    return 'priority must be low, medium, or high';
  }
  if (dueDate !== undefined && !isValidDueDate(dueDate)) {
    return 'dueDate must be a valid YYYY-MM-DD date';
  }
  return null;
}

function isValidDueDate(dueDate) {
  if (typeof dueDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    return false;
  }
  const parsedDate = new Date(`${dueDate}T00:00:00Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === dueDate;
}

function add(title, metadata = {}) {
  const validationError = validateMetadata(metadata);
  if (validationError) throw new Error(validationError);

  const { priority = 'medium', dueDate } = metadata;
  const task = { id: nextId++, title, done: false, priority };
  if (dueDate !== undefined) task.dueDate = dueDate;
  items.push(task);
  return task;
}

function reset() {
  items = [];
  nextId = 1;
}

module.exports = { list, add, validateMetadata, reset };
