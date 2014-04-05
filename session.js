var param = require('param');
var rcookie = require('routil-cookie');
var cookieSignature = require('cookie-signature');

exports.set =  function(key, val) {
  if (!val) {
    rcookie.setCookie(this, key, '', {expires: new Date(0)});
  }
  var scookie = cookieSignature.sign(val, param('secret'));
  rcookie.setCookie(this, key, scookie);
};

exports.get =  function(key) {
  var cookie = rcookie.getCookie(this, key);
  if (!cookie) return undefined;
  return cookieSignature.unsign(cookie, param('secret'));
};
