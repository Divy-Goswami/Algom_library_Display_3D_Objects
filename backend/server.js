const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000; // You can set your desired port here

// Middleware
app.use(cors({
  origin: 'http://localhost:3000' // Change to your frontend URL
}));
app.use(bodyParser.json());

// ✅ Keep database connection open
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create table if not exists
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS objects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      date TEXT,
      material TEXT
    )`
  );
});

// ✅ API route to fetch objects
app.get('/api/objects', (req, res) => {
  db.all('SELECT * FROM objects', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// ✅ Close database connection gracefully on exit
process.on('SIGINT', () => {
  console.log('Closing database connection.');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database closed.');
    }
    process.exit(0);
  });
});
