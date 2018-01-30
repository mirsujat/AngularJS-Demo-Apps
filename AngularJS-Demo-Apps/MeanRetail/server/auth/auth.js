
module.exports = function (wagner){
    
    require('./passport/passport')(wagner);
    var passport = require('passport');
    var express = require('express');
    var app = express.Router();

 
   
     //local auth
    app.post('/auth/signin', 
        passport.authenticate('local', {failureRedirect: '/fail'} ),
        function(req, res){
            res.send('Welcome, ' + req.user.profile.username);
        }
    );
    app.put('/auth/signup', wagner.invoke(function(User){
        return function(req, res){
            try{
                var profile = req.body.profile;
            }catch(e){
                return res
                    .status(status.BAD_REQUEST)
                    .json( { error: 'Sorry ! username or password is not specified. Please Try again..' } );       
            }
            
        req.user.profile = profile;
        req.user.save(function(error, user){
            if(error){
                return res
                    .status(status.INTERNAL_SERVER_ERROR)
                    .json( { error: error.toString() } );
            }
            res.send('Welcome, ' + req.user.profile.username);
        } );
        };
    } ) );
    
    // google auth
    app.get('/google', passport.authenticate('google', { scope: ['email'] } ) );
    app.get('/google/callback', 
        passport.authenticate('google', { failureRedirect: '/fail' } ),
        function(req, res){
            res.send('Welcome, ', req.user.profile.username);
            
        }
    );
    
      // Express routes for auth
    app.get('/auth/facebook',
    function(req, res, next) {
      var redirect = encodeURIComponent(req.query.redirect || '/');

      passport.authenticate('facebook',
        {
          scope: ['email'],
          callbackURL: 'http://localhost:3000/auth/facebook/callback?redirect=' + redirect
        })(req, res, next);
    });

    app.get('/auth/facebook/callback',
    function(req, res, next) {
      var url = 'http://localhost:3000/auth/facebook/callback?redirect=' +
        encodeURIComponent(req.query.redirect);
      passport.authenticate('facebook', { callbackURL: url })(req, res, next);
    },
    function(req, res) {
      res.redirect(req.query.redirect);
    });
    
}



