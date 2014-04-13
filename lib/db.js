var param = require('param');
var mongojs = require('mongojs');

var cols = ['users'];
var db = mongojs(param('mongo'), cols);

module.exports = function(id) {
  return db;
};
