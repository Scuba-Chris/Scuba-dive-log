'use strict';

/**
 *Dependencies
 */

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const methodoverride = require('method-override');
// const superagent = require('superagent');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    const method = request.body._method;
    delete request.body._method;
    return method;
  }
}));

app.set('view engine', 'ejs');
/**
 * Routes
 */

app.get('/', diveHistory);
app.post('/newDive', addNewDive);
app.get('*', (request, response) => response.status(404).send('This route does not exist'));

/**
 * From client
 */

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => new Error(err).exit());

// function diveHistory(request, response) {
//   response.render('index')
//   // response.send('yellow');
//   console.log('home route');
// }

function diveHistory(request, response) {
  let SQL = 'SELECT * from diveData;';
  return client.query(SQL)
    .then(results => {
      if (results.row.rowCount === 0) {
        response.render('pages/add_dive')
      } else {
        response.render('index')
        console.log('index');
      }
    })
    .catch(error => response.status(500).render('pages/error'), { error: 'yup, I fucked up' })
}

function addNewDive(request, response) {
  response.render('pages/add_dive');
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
