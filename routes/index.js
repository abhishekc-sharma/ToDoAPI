'use strict';

var express = require('express');
var listsEndpoint = require('./lists');
var itemsEndpoint = require('./items');


function attach() {
  var router = express.Router();

  router.get('/', function(req, res) {
    res.json({
      "messsage": "Welcome to the ToDoProject !"
    });
  });

  router.use('/lists', listsEndpoint());
  router.use('/lists', itemsEndpoint());

  return router;
}

module.exports = attach;
