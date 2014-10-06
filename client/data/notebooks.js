var agent = require('superagent');

exports.view = function(id, cb) {
  agent.get('/api/notebooks/' + id).end(function(res) {
    cb(res.body);
  });
};

exports.list = function(cb) {
  agent.get('/api/notebooks').end(function(res) {
    cb(res.body);
  });
};

exports.create = function(data, cb) {
  agent.post('/api/notebooks').send({name: data.name}).end(function(res) {
    if (!res.ok) return;
    cb(res.body);
  });
};

exports.del = function(id, cb) {
  agent.del('/api/notebooks/' + id).end(function(err, res) {
    cb(res.body);
  });
};
