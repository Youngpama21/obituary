const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/', (req, res) => {
  const { name, date_of_birth, date_of_death, content, author } = req.body;
  const slug = name.toLowerCase().replace(/ /g, '-');

  const stmt = db.prepare(`INSERT INTO obituaries (name, date_of_birth, date_of_death, content, author, slug) VALUES (?, ?, ?, ?, ?, ?)`);
  stmt.run(name, date_of_birth, date_of_death, content, author, slug, (err) => {
    if (err) {
      res.send('Error occurred: ' + err.message);
    } else {
      res.send('Obituary submitted successfully! <a href="/view_obituaries">View obituaries</a>');
    }
  });
  stmt.finalize();
});

app.get('/', (req, res) => {
  db.all(`SELECT * FROM obituaries`, (err, rows) => {
    if (err) {
      res.send('Error occurred: ' + err.message);
    } else {
      let html = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>View Obituaries</title>
        <meta name="description" content="View submitted obituaries">
        <meta name="keywords" content="obituaries, view obituaries, obituary platform">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <h1>Obituaries</h1>
        <table>
          <tr>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Date of Death</th>
            <th>Content</th>
            <th>Author</th>
            <th>Submission Date</th>
            <th>Slug</th>
            <th>Share</th>
          </tr>`;

      rows.forEach((row) => {
        const encodedUrl = encodeURIComponent(`http://localhost:${port}/view_obituaries#${row.slug}`);
        html += `<tr>
          <td>${row.name}</td>
          <td>${row.date_of_birth}</td>
          <td>${row.date_of_death}</td>
          <td>${row.content}</td>
          <td>${row.author}</td>
          <td>${row.submission_date}</td>
          <td>${row.slug}</td>
          
        </tr>`;
      });

      html += `</table>
      </body>
      </html>`;
      res.send(html);
    }
  });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, 'sitemap.xml'));
});
