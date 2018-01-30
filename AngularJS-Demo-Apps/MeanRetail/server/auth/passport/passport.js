require('dotenv').load()
var passport = require('passport');
var express = require('express');

module.exports = function (wagner) {
    
   var app = express();
   app.use(passport.initialize());
   app.use(passport.session());

   passport.serializeUser(function(user, done){
        return done(null, user._id);
    } );
    
   passport.deserializeUser(function(id, done){
        User
        .findOne({ _id: id })
        .exec(done);
    } );
    
    require('./strategies/local.strategy')();
    require('./strategies/google.strategy')();
    require('./strategies/facebook.strategy')(wagner);

};