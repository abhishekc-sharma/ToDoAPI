'use strict';

var request = require('supertest');
var app = require('../server').app;
var mongoose = require('mongoose');

var MONGODB_URL = process.env.MONGODB_URL || "localhost/test";

request = request.agent(app);

describe('/', function() {

  before(function(done) {
    // connect to mongodb with mongoose
    mongoose.connect(MONGODB_URL);

    mongoose.connection.on('error', done);

    mongoose.connection.once('open', done);
  });

  it('should respond with welcome message on get', function(done) {
    request
      .get('/')
      .expect(200, done);
  });
});

describe('/lists', function() {
  it('should get all lists, initially empty', function(done) {
    request
      .get('/lists')
      .expect(200, [], done);
  });

  it('should allow creation of new list', function(done) {
    request
      .post('/lists')
      .send({name: 'new list'})
      .expect(200, done);
  });

  it('should send error when no data is given on post', function(done) {
    request
      .post('/lists')
      .expect(400, /error/, done);
  });

  var persistId;
  it('should create the new list on the db', function(done) {
    request
      .get('/lists')
      .expect(200, /new list/)
      .end(function(err, res) {
        if(err) {
           done(err);
        }

        persistId = res.body[0]._id.trim();
        done();
      });
  });

  it('should allow modification of a list and change it on db', function(done) {
    request
      .put('/lists/' + persistId)
      .send({name: 'modified new list'})
      .expect(200, /modified new list/, done);
  });

  it('should respond with error when no data is given on put', function(done) {
    request
      .put('/lists/' + persistId)
      .expect(400, /error/, done);
  });

  it('should respond with error when invalid listId is given on put', function(done) {
    var invalidId = persistId + 'ge4';

    request
      .put('/lists/' + invalidId)
      .send({name: 'not gonna matter anyway'})
      .expect(404, /error/, done);
  });

  it('should allow deletion of a list and also change it on db', function(done) {
    request
      .delete('/lists/' + persistId)
      .expect(200, /Successfully deleted/, done);
  });

  it('should respond with error when invalid listId is give on delete', function(done) {
    request
      .delete('/lists/' + persistId)
      .expect(404, /error/, done);
  });

  after(function() {
    mongoose.disconnect();
  });
});
