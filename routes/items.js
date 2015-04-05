'use strict';

var express = require('express');
var debug = require('debug')('items-endpoint');

// get the List model
var List = require('../models/List');
// get the Item model
var Item = require('../models/Item');

function attach() {
  var router = express.Router();

  router.get('/:listId/items', function(req, res) {
    debug('get items in list ' + req.params.listId);

    // get list id from params
    var listId = req.params.listId;

    // get the required list and populate the items field
    List
      .findById(listId)
      .populate('items')
      .exec( function(err, list) {
        if(err || !list) {
          return res.status(404).json({'error': 'Invalid listId'});
        }

        // send client the array of all items
        res.json(list.items);
      });
  });

  router.post('/:listId/items', function(req, res) {
    debug('add item to list ' + req.params.listId);

    // get the list id
    var listId = req.params.listId;

    // get item description from request body
    var newItemDescription = req.body.description;
    if(!newItemDescription) {
      return res.status(400).json({'error': 'Need data for new item'});
    }

    List.findById(listId, function(err, list) {
      if(err || !list) {
        return res.status(404).json({'error': 'Invalid listId'});
      }

      // create the new item instance and initialize the fields
      var newItem = new Item();
      newItem.description = newItemDescription;
      newItem.createdOn = Date.now();

      newItem.save(function(err, it) {
        if(err || !it) {
          return res.status(400).json({'error': 'Failed to add new item to list, Validation error'});
        }

        List.findByIdAndUpdate(listId, {$push: {'items': it.id}}, function(err) {
          if(err) {
            return res.json({'error': 'Failed to add new item to list'});
          }

          res.json(it);
        });
      });

    });
  });

  router.delete('/:listId/items/:itemId', function(req, res) {
    debug('delete item from list');

    // get the requested list
    var listId = req.params.listId;
    List.findById(listId, function(err, list) {
      if(err || !list) {
        return res.status(404).json({'error': 'Invalid listId'});
      }

      // get the requested item
      var itemId = req.params.itemId;
      Item.findByIdAndRemove(itemId, function(err, it) {
        if(err || !it) {
          return res.status(404).json({'error': 'Invalid itemId'});
        }

        List.findByIdAndUpdate(listId, {$pull: {'items': it.id}}, function(err) {
          if(err) {
            return res.json({'error': 'Failed to delete item from list'});
          }

          res.json({'message': 'Successfully remove item from list'});
        });
      });
    });
  });

  router.put('/:listId/items/:itemId', function(req, res) {
    debug('put item from list');

    var listId = req.params.listId;
    List.findById(listId, function(err, l) {
      if(err || !l) {
        return res.status(404).json({'error': 'Invalid listId'});
      }

      var newDescription = req.body.description;
      if(!newDescription) {
        return res.status(400).json({'error': 'Need description data to update'});
      }

      var itemId = req.params.itemId;
      Item.findById(itemId, function(err, item) {
        if(err || !item) {
          return res.status(404).json({'error': 'Invalid itemId'});
        }

        item.description = newDescription;
        item.save(function(err, it) {
          if(err) {
            return res.status(400).json({'error': 'Error updating item, Validation error'});
          }

          res.json(it);
        });
      });
    });
  });
  return router;
}



module.exports = attach;
