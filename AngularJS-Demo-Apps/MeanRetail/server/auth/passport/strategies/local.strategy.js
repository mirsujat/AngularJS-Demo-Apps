var passport = require('passport');
var Strategy = require('passport-local').Strategy;


module.exports = function(User){
passport.use(new Strategy(
  function(username, password, cb) {
    User.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.profile.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));
 }; 
  
 
