'use strict';

var start = require('./server').startServer;
var debug = require('debug')('server');
var mongoose = require('mongoose');

var MONGODB_URL = process.env.MONGODB_URL || "localhost/test";

// connect to mongodb with mongoose
mongoose.connect(MONGODB_URL);

mongoose.connection.on('error', function() {
  debug('Mongoose Errored !!');
});

mongoose.connection.once('open', function() {
  debug('Mongoose Successfully Connected ' + MONGODB_URL);
});

start();


;
