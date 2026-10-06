const express = require('express');
const path = require('path');
const tasks = require('./tasks');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/tasks', (req, res) => {
  const { priority, sort, order } = req.query;

  if (priority !== undefined && !tasks.isPriority(priority)) {
    return res.status(400).json({ error: 'priority must be low, medium, or high' });
  }
  if (sort !== undefined && sort !== 'dueDate') {
    return res.status(400).json({ error: 'sort must be dueDate' });
  }
  if (order !== undefined && order !== 'asc' && order !== 'desc') {
    return res.status(400).json({ error: 'order must be asc or desc' });
  }

  res.json(tasks.list({ priority, sort, order }));
});

app.post('/tasks', (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'request body must be an object' });
  }

  try {
    res.status(201).json(tasks.add(req.body));
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;
    res.status(400).json({ error: error.message });
  }
});

module.exports = app;
