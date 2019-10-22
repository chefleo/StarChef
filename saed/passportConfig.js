const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const moongose = require ('mongoose');

var User       = require('./app/models/user');

passport.use(
  new localStrategy({ usernameField: 'email' },
      (username, password, done) => {
          User.findOne({ email: username },
            (err, user) => {
              if(err){
                return done(err);
              } else if(!user){
                return done(null, false, { message: 'Email is not registrated' });
              } else if (!user.validPassword(password)){
                return done(null, false, {message: "Wrong password"});
              } else {
                return done(null, user);
              }
            });
      })
);
