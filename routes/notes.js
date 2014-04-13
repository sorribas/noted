var getdb = require('../lib/db');

exports.list = function(req, res) {
  var db = getdb(req.userId());
  db.notes.find({notebook_id: db.ObjectId(req.params.id)}).sort({updated: -1}, function(err, notes) {
    if (err) return res.error(500, err.toString());
    res.send(notes);
  });
};

exports.update = function(req, res) {
  var db = getdb(req.userId());
  req.on('json', function(note) {
    note._id = db.ObjectId(req.params.id);
    note.notebook_id = db.ObjectId(note.notebook_id);

    db.notes.save(note, function(err, note) {
      if (err) return res.error(500, err.toString());
      res.send(note);
    });
  });
};

exports.create = function(req, res) {
  var db = getdb(req.userId());
  req.on('json', function(note) {
    note.notebook_id = db.ObjectId(note.notebook_id);

    db.notes.save(note, function(err, note) {
      if (err) return res.error(500, err.toString());
      res.send(note);
    });
  });
};

exports.delete = function(req, res) {
  var db = getdb(req.userId());
  db.notes.remove({_id: db.ObjectId(req.params.id)}, function(err) {
    if (err) return res.error(500, err.toString());
    res.send({ok: true});
  });
};
