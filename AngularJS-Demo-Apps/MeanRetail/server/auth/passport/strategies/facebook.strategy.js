require('dotenv').load()
var passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy,
mongoose = require('mongoose'),
User = mongoose.model('../../../schemas/user');

    
module.exports = function () {

        passport.use(new FacebookStrategy(
    {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        profileFields: ['emails'],
        enableProof: true
      
    },
    function(accessToken, refreshToken, profile, done){
        if(!profile.id){
            return done('No such Facebook id exits....   !');
        }
        User.findOneAndUpdate(
            {'data.oauth': profile.id},
            {
                $set: {
                    'profile.username': profile.emails[0].value,
                    'profile.picture': 'http://graph.facebook.com/' + profile.id.toString() + '/picture?type=large'
                    }
            },
                    
            { 'new': true, upsert: true, runValidators: true },
            function(error, user){
                done(error, user);
            }
            );
       
    }

  ) );
};