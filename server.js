'use strict';

/**
 *Dependencies
 */

const cors = require('cors');
require('dotenv').config();
const express = require('express');
const methodoverride = require('method-override');
const pg = require('pg');

const pgClient = new pg.Client(process.env.DATABASE_URL);
pgClient.on('error', err => new Error(err).exit());

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.listen(PORT, () => console.log(`listening on ${PORT}`));

app.use(methodoverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}))
app.set('view engine', 'ejs');

// pgClient.connect()
//   .then(() => {
//     app.listen(PORT, () => console.log(`listening on ${PORT}`));
//   })
//   .catch(err => new Error(err).exit());
