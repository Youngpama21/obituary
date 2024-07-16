const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./obituary_platform.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS obituaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    date_of_death DATE NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    slug TEXT UNIQUE NOT NULL
  )`);
});

module.exports = db;
