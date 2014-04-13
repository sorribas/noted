var param = require('param');
var crypto = require('crypto');
var seaport = require('seaport');
var app = require('./lib/app');
var getdb = require('./lib/db');
var ports = seaport.connect(param('registry.host'), param('registry.port'));

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

app.all('*', function(req, res) {
  res.render('index.hbs');
});

var port = ports.register('app');
app.listen(port);
console.log('NotEd server listening on port ' + port);
