// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var baseurl = "localhost";
// var baseurl ="43.240.66.86";

// connection to mongodb
mongoose.connect('mongodb://' + baseurl + '/music-app')
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));


// Get our API routes
const api = require('./server/routes/api');

const app = express();




app.use(logger('dev'));//to show logs on console

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on ` + baseurl + `:${port}`));