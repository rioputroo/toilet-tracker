import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('bathroom.db');

app.use(cors());
app.use(express.json());

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS bathroom_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_name TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Get all visits for today
app.get('/api/visits', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const visits = db.prepare(`
      SELECT * FROM bathroom_visits 
      WHERE date(timestamp) = date(?)
      ORDER BY timestamp DESC
    `).all(today);
    
    res.json(visits);
  } catch (error) {
    console.error('Error getting visits:', error);
    res.status(500).json({ error: 'Failed to fetch visits' });
  }
});

// Add new visit
app.post('/api/visits', (req, res) => {
  try {
    const { employee_name } = req.body;
    
    if (!employee_name || typeof employee_name !== 'string' || !employee_name.trim()) {
      return res.status(400).json({ error: 'Employee name is required' });
    }

    const stmt = db.prepare('INSERT INTO bathroom_visits (employee_name) VALUES (?)');
    const result = stmt.run(employee_name.trim());
    
    // Fetch and return the newly created visit
    const newVisit = db.prepare('SELECT * FROM bathroom_visits WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newVisit);
  } catch (error) {
    console.error('Error adding visit:', error);
    res.status(500).json({ error: 'Failed to add visit' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});