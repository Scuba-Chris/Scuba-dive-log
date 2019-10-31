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
client.on('error', err => new Error(err).exit());

/**
 * Routes
 */

app.get('/', diveHistory);
app.get('/newdive', addNewDive);
app.post('/newdive', newDiveData);
app.get('/pages/details/:dive_id', getDiveDetails)
app.put('/pages/details/:dive_id', editDive)
app.delete('/pages/details/:dive_id', deleteDive)
app.get('*', (request, response) => response.status(404).send('This route does not exist'));

/**
 * From client
 */

function diveHistory(request, response) {
  let SQL = 'SELECT * from divedata ORDER BY id;';
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
  let { date, max_depth, avg_depth, duration, dive_site, dive_buddy, gear_config } = request.body;
  let SQL = 'INSERT INTO divedata( date, max_depth, avg_depth, duration, dive_site, dive_buddy, gear_config ) VALUES( $1, $2, $3, $4, $5, $6, $7 );';
  let values = [parseInt(date), parseInt(max_depth), parseInt(avg_depth), parseInt(duration), dive_site, dive_buddy, gear_config];
  return client.query(SQL, values)
    .then(() => response.redirect('/'))
    .catch(error => response.status(500).render('pages/error'));
}

function getDiveDetails(request, response) {
  let SQL = 'SELECT * FROM divedata WHERE id=$1;';
  let values = [request.params.dive_id];
  return client.query(SQL, values)
    .then(results => response.render('pages/details', { dives: results.rows[0] }))
    .catch(error => response.status(500).render('pages/error'))
}

function editDive(request, response) {
  let { date, max_depth, avg_depth, duration, dive_site, dive_buddy, gear_config } = request.body;
  let SQL = 'UPDATE divedata SET date=$1, max_depth=$2, avg_depth=$3, duration=$4, dive_site=$5, dive_buddy=$6, gear_config=$7 WHERE id=$8;';
  let values = [parseInt(date), parseInt(max_depth), parseInt(avg_depth), parseInt(duration), dive_site, dive_buddy, gear_config, request.params.dive_id];
  return client.query(SQL, values)
    .then(() => response.redirect('/'))
    .catch(error => response.status(500).render('pages/error', { error: error }))
}

function deleteDive(request, response) {
  let SQL = 'DELETE FROM divedata WHERE id=$1;'
  let value = [request.params.dive_id]
  return client.query(SQL, value)
    .then(() => response.redirect('/'))
    .catch(error => response.status(500).render('pages/error'))
}

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`)
    })
  });
