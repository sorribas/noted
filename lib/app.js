var root = require('root');
var fs = require('fs');
var handlebars = require('handlebars');
var send = require('send');
var session = require('noted-session');
var app = root();

var templates = {};

app.use('response.render', function(file, vars) {
  var res = this;

  if (templates[file]) return res.send(templates[file](vars));

  fs.readFile('./views/' + file, {encoding: 'utf8'}, function(err, data) {
    templates[file] = handlebars.compile(data);
    res.send(templates[file](vars));
  });
});

app.use('response.session', session.set);
app.use('request.session', session.get);

app.use('request.userId', function() {
  return this.session('user');
});

app.get("/public/*", function(req, res) {
	send(req, './public/'+req.params.glob).pipe(res);
});

module.exports = app;
