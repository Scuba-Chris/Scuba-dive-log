'use strict';

/**
 *Dependencies
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const methodoverride = require('method-override');
// const superagent = require('superagent');

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

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => new Error(err).exit());

/**
 * Routes
 */

app.get('/', diveHistory);
app.get('/newdive', addNewDive);
app.post('/newdive', newDiveData);
app.get('*', (request, response) => response.status(404).send('This route does not exist'));

/**
 * From client
 */


// function diveHistory(request, response) {
//   response.render('index')
//   // response.send('yellow');
//   console.log('home route');
// }

function diveHistory(request, response) {
  let SQL = 'SELECT * from divedata;';
  return client.query(SQL)
    .then(results => {
      if (results.rows[0] === 0) {
        response.render('pages/add_dive')
      } else {
        response.render('index', { dives: results.rows })
      }
    })
    .catch(error => response.status(500).render('pages/error'), { error: 'yup, I fucked up' })
}

function addNewDive(request, response) {
  response.render('pages/addDive');
}

function newDiveData(request, response) {
  console.log('im inside of this damn function');
  let { date, max_depth, avg_depth, duration, dive_site, dive_buddy, gear_config } = request.body;
  let SQL = 'INSERT INTO divedata( date, max_depth, avg_depth, duration, dive_site, dive_buddy, gear_config ) VALUES( $1, $2, $3, $4, $5, $6, $7 );';
  let values = [parseInt(date), parseInt(max_depth), parseInt(avg_depth), parseInt(duration), dive_site, dive_buddy, gear_config];
  return client.query(SQL, values)
    .then(() => response.redirect('/'))
  // .then(() => {
  //   SQL = 'SELECT * FROM divedata WHERE date=$1;';
  //   values = [request.body.date];
  //   return client.query(SQL, values)
  //     .then(response.redirect('/'))
  //     .catch(error => response.status(500).render('pages/error'))
  // })
    .catch(error => response.status(500).render('pages/error'));
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
