'use strict';

var app = require('./');
var debug = require('debug')('server');

var NODEJS_PORT = parseInt(process.env.NODEJS_PORT) || 4000;

app.listen(NODEJS_PORT, function() {
  debug('Server listening on port %s', NODEJS_PORT);
});
