'use strict';

var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
  res.json({
    "messsage": "Welcome to the ToDoProject !"
  });
});

module.exports = router;
