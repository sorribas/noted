var param = require('param');
var root = require('root');
var handlebars = require('handlebars');
var send = require('send');
var fs = require('fs');
var crypto = require('crypto');
var getdb = require('./db');
var session = require('./session');
var notebooks = require('./routes/notebooks');
var notes = require('./routes/notes');

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
	send(req, __dirname+'/public/'+req.params.glob).pipe(res);
});

app.get('/login', function(req, res) {
  res.render('login.hbs');
});

app.post('/login', function(req, res) {
  var db = getdb(req.userId());
  req.on('form', function(form) {
    var hash = crypto.createHash('sha1').update(form.email + form.password + param('salt')).digest('hex');
    db.users.findOne({email: form.email, password: hash}, function(err, usr) {
      if (err) return res.error(500, err.toString());
      if (usr) res.session('user', usr._id.toString());
      res.redirect('/');
    });
  });
});

app.post('/register', function(req, res) {
  var db = getdb(req.userId());
  req.on('form', function(form) {
    var pass = crypto.createHash('sha1').update(form.email + form.password + param('salt')).digest('hex');
    db.users.save({
      email: form.email,
      password: pass
    }, function(err, usr) {
      if (err) return res.error(500, err.toString());
      res.redirect('/');
    });
  });
});

app.all('*', function(req, res, next) {
  var user = req.session('user');
  if (!user) return res.redirect('/login');
  next();
});

app.get('/logout', function(req, res, next) {
  res.session('user', '');
  res.redirect('/login');
});

app.get('/api/notebooks', notebooks.list);
app.post('/api/notebooks', notebooks.add);
app.del('/api/notebooks/{id}', notebooks.delete);

app.get('/api/notebooks/{id}', notes.list);
app.put('/api/notes/{id}', notes.update);
app.post('/api/notes', notes.create);
app.del('/api/notes/{id}', notes.delete);

app.all('*', function(req, res) {
  res.render('index.hbs');
});

app.listen(param('port'));
console.log('NotEd server listening on port ' + param('port'));
