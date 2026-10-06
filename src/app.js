const express = require('express');
const tasks = require('./tasks');

const app = express();
app.use(express.json());

app.get('/tasks', (req, res) => {
  const { priority, sort, order } = req.query;
  if (priority !== undefined && tasks.validateMetadata({ priority })) {
    return res.status(400).json({ error: 'priority must be low, medium, or high' });
  }
  if (sort !== undefined && sort !== 'dueDate') {
    return res.status(400).json({ error: 'sort must be dueDate' });
  }
  if (order !== undefined && order !== 'asc' && order !== 'desc') {
    return res.status(400).json({ error: 'order must be asc or desc' });
  }
  if (order !== undefined && sort !== 'dueDate') {
    return res.status(400).json({ error: 'order requires sort=dueDate' });
  }
  res.json(tasks.list({ priority, sort, order }));
});

app.post('/tasks', (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'request body must be an object' });
  }
  const { title, priority, dueDate } = body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const validationError = tasks.validateMetadata({ priority, dueDate });
  if (validationError) return res.status(400).json({ error: validationError });
  res.status(201).json(tasks.add(title, { priority, dueDate }));
});

module.exports = app;
