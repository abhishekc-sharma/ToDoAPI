'use strict';

// get mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ListSchema = Schema({
  name: {
    type: String,
    required: true,
    validate: /((\s*)[\S]+(\s*))+/
  },

  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
});

module.exports = mongoose.model('List', ListSchema);
