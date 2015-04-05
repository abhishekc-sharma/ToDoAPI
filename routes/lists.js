'use strict';

var express = require('express');
var debug = require('debug')('lists-endpoint');

// get List model
var List = require('../models/List');

function attach() {
  var router = express.Router();

  router.get('/', function(req, res) {
    debug('get lists');

    // Get all lists and send
    List.find({}, function(err, lists) {
      if(err) {
        return res.json({'error': 'Error occured while fetching lists'});
      }
      res.json(lists);
    });
  });

  router.post('/', function(req, res) {
    debug('post lists, name: %s', req.body.name);

    // get the name from request body
    if(!req.body.name) {
      return res.status(400).json({'error': 'Need name parameter for new list'});
    }
    var name = req.body.name;

    // create a new instance of list model with name data
    var newList = new List();
    newList.name = name;

    // save the newly created list
    newList.save(function(err, l) {
      if(err) {
        return res.status(400).json({'error': 'Failed to add list, Validation Error'});
      }
      // send back the newly created list
      res.json(l);
    });
  });

  router.delete('/:listId', function(req, res) {
    debug('del lists:%s', req.params.listId);

    // get the listid to delete
    var listId = req.params.listId;

    // delete the list with the id
    List.findById(listId, function(err, l) {
      if(err || !l) {
        return res.status(404).json({'error': 'Ivalid listId'});
      }

      if(l.items.length !== 0) {
        return res.status(400).json({'error': 'Can\'t delete non empty list'});
      }

      l.remove(function(err) {
        res.json({'message': 'Successfully deleted'});
      });
    });
  });

  router.put('/:listId', function(req, res) {
    debug('put lists:%s', req.params.listId);

    // get the data that is to be updated
    if(!req.body.name) {
      return res.status(400).json({'error': 'Need data to update'});
    }
    var name = req.body.name;

    // get the listid to update
    var listId = req.params.listId;

    // find list with the required id
    List.findById(listId, function(err, list) {
      if(err || !list) {
        return res.status(404).json({'error': 'Invalid listId'});
      }

      // Change name as required
      list.name = name;

      // save modified instance
      list.save(function(err, l) {
        if(err) {
          return res.status(400).json({'error': 'Failed to update list, Validation error'});
        }

        res.json(l);
      });
    });
  });

  return router;
}

module.exports = attach;
