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
app.get('/newDive', addNewDive);
app.post('/newDiveData', newDiveData);
app.get('*', (request, response) => response.status(404).send('This route does not exist'));

/**
 * From client
 */

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => new Error(err).exit());

// function diveHistory(request, response) {
//   response.render('index')
//   // response.send('yellow');
//   console.log('home route');
// }

function diveHistory(request, response) {
  let SQL = 'SELECT * from divedata;';
  return client.query(SQL)
    .then(results => {
      if (results.row === 0) {
        response.render('pages/newDive')
      } else {
        response.render('index')
        console.log('index');
      }
    })
    .catch(error => response.status(500).render('pages/error'), { error: 'yup, I fucked up' })
}

function addNewDive(request, response) {
  console.log()
  response.render('pages/add_dive');
}

function newDiveData(request, response) {
  console.log(require.body.date)
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
