'use strict';

var request = require('supertest');
var app = require('../server').app;
var mongoose = require('mongoose');

var MONGODB_URL = process.env.MONGODB_URL || "localhost/test";

var request = request(app);

describe('/lists/:listId/items', function() {
  var persistId;
  var itemId;
  before(function(done) {
    // connect to mongodb with mongoose
    mongoose.connect(MONGODB_URL);

    mongoose.connection.on('error', done);

    mongoose.connection.once('open', done);
  });

  before(function(done) {
    request
      .post('/lists')
      .send({name: 'new list'})
      .end(function(err, res) {
        if(err) {
          console.log(err);
          done(err);
        }
        persistId = res.body._id.trim();
        done();
      });
  });

  after(function(done) {
    request
      .delete('/lists/' + persistId)
      .end(function(err, res) {
        if(err) {
          done(err);
        }

        done();
      });
  });

  after(function() {
    mongoose.disconnect();
  });

  it('Should fetch the items from a list, initially empty', function(done) {
    request
      .get('/lists/' + persistId + '/items')
      .expect(200, [], done);
  });

  it('Should fail when given invalid listId on get', function(done) {
    request
      .get('/lists/' + persistId + 'a' + '/items')
      .expect(404, /Invalid listId/, done);
  });

  it('Should add new item to list', function(done) {
    request
      .post('/lists/' + persistId + '/items')
      .send({'description': 'This is a new item'})
      .expect(200, /This is a new item/)
      .end(function(err, res) {
        if(err) {
          done(err);
        }

        itemId = res.body._id;
        done();
      });
  });

  it('Should fail when given invalid listId on post', function(done) {
    request
      .post('/lists/' + persistId + 'g' + '/items')
      .send({'description': 'This is a new item'})
      .expect(404, /Invalid listId/, done);
  });

  it('Should fail when not give description data on post', function(done) {
    request
      .post('/lists/' + persistId + '/items')
      .expect(400, /Need data/, done);
  });

  it('Should modify item in list', function(done) {
    request
      .put('/lists/' + persistId + '/items/' + itemId)
      .send({'description': 'Modified desc'})
      .expect(200, /Modified desc/, done);
  });


  it('Should fail when given invalid listId on put', function(done) {
    request
      .put('/lists/' + persistId + 'b' + '/items/' + itemId)
      .send({'description': 'Modified desc'})
      .expect(404, /Invalid listId/, done);
  });


  it('Should fail when given invalid itemId on put', function(done) {
    request
      .put('/lists/' + persistId + '/items/' + itemId + 'a')
      .send({'description': 'Modified desc'})
      .expect(404, /Invalid itemId/, done);
  });


  it('Should fail when not give description data on put', function(done) {
    request
      .put('/lists/' + persistId + '/items/' + itemId)
      .expect(400, /Need description/, done);
  });

  it('Should fail when given invalid listId on delete', function(done) {
    request
      .delete('/lists/' + persistId + 'a' + '/items/' + itemId)
      .expect(404, /Invalid listId/, done);
  });

  it('Should fail when given invalid itemId on delete', function(done) {
    request
      .delete('/lists/' + persistId + '/items/' + itemId + 'a')
      .expect(404, /Invalid itemId/, done);
  });

  it('Should fail when deleting non-empty list', function(done) {
    request
      .delete('/lists/' + persistId)
      .expect(400, /delete non empty list/, done);
  });

  it('Should delete item from list', function(done) {
    request
      .delete('/lists/' + persistId + '/items/' + itemId)
      .expect(200, done);
  });



});
