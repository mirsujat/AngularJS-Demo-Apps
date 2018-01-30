require('dotenv').load()
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;




module.exports = function (User) {
    passport.use(new GoogleStrategy({
            clientID: '822246465440-rbv8o8b5t465fupp0voesgfipapmdio1.apps.googleusercontent.com',
            clientSecret: '2dXAnFE6ZxBPjxhI1MdSRfeF',
            callbackURL: 'http://localhost:3000/auth/google/callback'
        },
        function (req, accessToken, refreshToken, profile, done) {
            if(!profile.emails || !profile.emails.length){
            return done('No email Asscociated with This Account !');
            }
            
            User.findAndUpdate(
                {'data.oauth': profile.id},
            {
                $set: {
                    'profile.username': profile.emails[0].value,
                    'profile.picture': profile._json.profile_image_url,
                }
            },
            {'new': true, upsert: true, runValidators: true },
            function(error, user){
                done(error, user);
            }
            );
        }
    ));
};