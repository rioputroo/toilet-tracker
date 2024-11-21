import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('bathroom.db');

app.use(cors());
app.use(express.json());

// Drop existing tables and recreate with correct schema
db.exec(`
  DROP TABLE IF EXISTS bathroom_visits;
  DROP TABLE IF EXISTS employees;

  CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE bathroom_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );
`);

// Get all employees
app.get('/api/employees', (req, res) => {
  try {
    const employees = db.prepare('SELECT * FROM employees ORDER BY name').all();
    res.json(employees);
  } catch (error) {
    console.error('Error getting employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Add new employee
app.post('/api/employees', (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Employee name is required' });
    }

    const stmt = db.prepare('INSERT INTO employees (name) VALUES (?)');
    const result = stmt.run(name.trim());
    const newEmployee = db.prepare('SELECT * FROM employees WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newEmployee);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Employee already exists' });
    } else {
      console.error('Error adding employee:', error);
      res.status(500).json({ error: 'Failed to add employee' });
    }
  }
});

// Get today's summary
app.get('/api/summary', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const summary = db.prepare(`
      SELECT 
        e.id,
        e.name,
        COUNT(v.id) as visit_count
      FROM employees e
      LEFT JOIN bathroom_visits v 
        ON e.id = v.employee_id 
        AND date(v.timestamp) = date(?)
      GROUP BY e.id, e.name
      ORDER BY e.name
    `).all(today);

    res.json(summary);
  } catch (error) {
    console.error('Error getting summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Add visit for employee
app.post('/api/visits', (req, res) => {
  try {
    const { employee_id } = req.body;
    if (!employee_id) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    // First check if employee exists
    const employee = db.prepare('SELECT id FROM employees WHERE id = ?').get(employee_id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const stmt = db.prepare('INSERT INTO bathroom_visits (employee_id) VALUES (?)');
    stmt.run(employee_id);

    // Return updated summary for this employee
    const summary = db.prepare(`
      SELECT 
        e.id,
        e.name,
        COUNT(v.id) as visit_count
      FROM employees e
      LEFT JOIN bathroom_visits v 
        ON e.id = v.employee_id 
        AND date(v.timestamp) = date('now')
      WHERE e.id = ?
      GROUP BY e.id, e.name
    `).get(employee_id);

    res.status(201).json(summary);
  } catch (error) {
    console.error('Error adding visit:', error);
    res.status(500).json({ error: 'Failed to add visit' });
  }
});

// Reset today's visits
app.delete('/api/visits/today', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const stmt = db.prepare("DELETE FROM bathroom_visits WHERE date(timestamp) = date(?)");
    stmt.run(today);
    res.json({ message: 'Successfully reset today\'s visits' });
  } catch (error) {
    console.error('Error resetting visits:', error);
    res.status(500).json({ error: 'Failed to reset visits' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});