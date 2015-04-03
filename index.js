'use strict';

// import modules
var express = require('express');
var mongoose = require('mongoose');
var compression = require('compression');
var bodyParser = require('body-parser');
var logger = require('morgan');
var debug = require('debug')('server');

// import custom modules
var routes = require('./routes');

// set up constants
var NODEJS_PORT = parseInt(process.env.NODEJS_PORT) || 4000;
var MONGODB_URL = process.env.MONGODB_URL || "localhost/test";

// connect to mongodb with mongoose
mongoose.connect(MONGODB_URL);

mongoose.connection.on('error', function() {
  debug('Mongoose Errored !!');
});

mongoose.connection.once('open', function() {
  debug('Mongoose Successfully Connected');
});

var app = express();

debug('Adding express middleware');
// Log requests
app.use(logger('dev'));

// Add body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: 'true'}));

// Add response compression middleware
app.use(compress());

// Add the routes to the app
app.use('/', routes);

app.listen(NODEJS_PORT, function() {
  debug('Listening on port %d', NODEJS_PORT);
});
