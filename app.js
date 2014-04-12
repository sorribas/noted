var param = require('param');
var crypto = require('crypto');
var app = require('./lib/app');
var getdb = require('./lib/db');
var notebooks = require('./routes/notebooks');
var notes = require('./routes/notes');

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
      res.session('user', usr._id.toString());
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
