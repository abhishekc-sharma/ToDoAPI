'use strict';

var request = require('supertest');
var start = require('../server').startServer;
var stop = require('../server').closeServer;

var NODEJS_PORT = parseInt(process.env.NODEJS_PORT) || 4000;

describe('Server', function() {
  before(function() {
    start();
  });

  it('Should start server on proper port', function(done) {

    request('localhost:' + NODEJS_PORT)
      .get('/')
      .expect(200, done);
  });

  after(function() {
    stop();
  });
});
