var param = require('param');
var mongojs = require('mongojs');
var subcol = require('submongojs');
var mongohooks = require('mongohooks');

var cols = ['users', 'notebooks', 'notes'];

var db = mongojs(param('mongo'), cols);

mongohooks(db.notes).save(function (document, next) {
  document.updated = new Date();
  next();
});

module.exports = function(id) {
  var dbr = { ObjectId: db.ObjectId };
  var oid;
  try {
    oid = db.ObjectId(id);
  } catch(e) {
    dbr.users = db.users;
    return dbr;
  }

  cols.forEach(function(col) {
    if (col === 'users') return (dbr.users = db.users);
    dbr[col] = subcol(db[col], db.ObjectId(id), 'user_id');
  });

  return dbr;
};
