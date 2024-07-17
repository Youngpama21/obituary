const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('obituary_platform.db');

// Middleware setup
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public'))); 

// Create table if not exists
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS obituaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        date_of_birth DATE,
        date_of_death DATE,
        content TEXT,
        author TEXT,
        submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        slug TEXT UNIQUE
    )`);
});

// Routes
app.get('/', (req, res) => {
    db.all('SELECT * FROM obituaries ORDER BY submission_date DESC', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Database error');
            return;
        }
        res.render('index', { obituaries: rows });
    });
});

app.get('/submit', (req, res) => {
    res.render('obituary_form'); 
});

app.post('/submit', (req, res) => {
    const { name, date_of_birth, date_of_death, content, author } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    db.run(`INSERT INTO obituaries (name, date_of_birth, date_of_death, content, author, slug)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [name, date_of_birth, date_of_death, content, author, slug], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Database error');
            return;
        }
        res.redirect('/');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
