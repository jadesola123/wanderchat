const express = require('express');
const app = express();
const sql = require('mssql');
const http = require('http');
const path = require('path');

const config = {
  user: 'wander',
  password: 'Passworld23$',
  server: 'wander.database.windows.net',
  database: 'WanderDb',
  options: {
    encrypt: true,
  },
};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.get('/memes', (req, res) => {
  const query = 'SELECT TOP 1 url, caption FROM Memes ORDER BY NEWID()';

  sql.connect(config)
    .then((pool) => {
      return pool.request().query(query);
    })
    .then((result) => {
      const meme = result.recordset[0];
      res.json(meme);
    })
    .catch((err) => {
      console.error('Failed to retrieve meme:', err);
      res.status(500).json({ error: 'Failed to retrieve meme' });
    });
});

const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});