var agent = require('superagent');

exports.list = function(id, cb) {
  agent.get('/api/notes/?notebookId=' + id).end(function(res) {
    cb(res.body);
  });
};

exports.create = function(note, cb) {
  agent.post('/api/notes').send(note).end(function(res) {
    cb(res.body);
  });
};

exports.update = function(note, cb) {
  agent.put('/api/notes/' + note._id).send(note).end(function(res) {
    cb(res.body);
  });
};

exports.del = function(note, cb) {
  agent.del('/api/notes/' + note._id).end(function(res) {
    cb(res.body);
  });
};
