'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

// get the router from routes/index.js
var routes = require('./routes');

var app = express();

// Log requests
app.use(logger('dev'));

// Add body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: 'true'}));

// Add the routes to the app
app.use('/', routes);

app.listen(4000);
