var getdb = require('../db');

exports.list = function(req, res) {
  var db = getdb(req.userId());
  db.notebooks.find(function(err, notebooks) {
    if (err) return res.error(500, err.toString());
    res.send(notebooks);
  });
};

exports.add = function(req, res) {
  var db = getdb(req.userId());
  req.on('json', function(form) {
    var notebook = {
      name: form.name,
    };
    db.notebooks.insert(notebook, function(err, doc) {
      if (err) return res.error(500, err.toString());
      res.send(doc);
    });
  });
};

exports.delete = function(req, res) {
  var db = getdb(req.userId());
  db.notebooks.remove({_id: db.ObjectId(req.params.id)}, function(err) {
    if (err) return res.error(500, err.toString());
    res.send({ok: true});
  });
};
