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

var app = express();

// Log requests
app.use(logger('dev'));

// Add body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: 'true'}));

// Add response compression middleware
app.use(compression());

// Add the routes to the app
app.use('/', routes());
debug('Added routes');

debug('Added express middleware');

var server;

function startServer() {
  server = app.listen(NODEJS_PORT, function() {
    debug('Listening on port %d', NODEJS_PORT);
  });
}

function closeServer() {
  server.close();
}

module.exports.app = app;
module.exports.startServer = startServer;
module.exports.closeServer = closeServer;
