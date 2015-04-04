'use strict';

// get mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = Schema({
  description: {
    type: String,
    required: true
  },

  belongsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List'
  },

  createdOn: {
    type: Date,
    required: true
  },

  completeBy: Date,
  completed: Boolean,
  completedOn: Date
});

module.exports = mongoose.model('Item', ItemSchema);
