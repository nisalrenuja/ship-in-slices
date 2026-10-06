let items = [];
let nextId = 1;

function list() {
  return items;
}

function add(title) {
  const task = { id: nextId++, title, done: false };
  items.push(task);
  return task;
}

function reset() {
  items = [];
  nextId = 1;
}

module.exports = { list, add, reset };
