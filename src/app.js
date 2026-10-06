const express = require('express');
const tasks = require('./tasks');

const app = express();
app.use(express.json());

app.get('/tasks', (req, res) => res.json(tasks.list()));

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  res.status(201).json(tasks.add(title));
});

module.exports = app;
