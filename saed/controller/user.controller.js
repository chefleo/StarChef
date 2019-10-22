const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = require('../app/models/user');

//login
module.exports.authenticate = (req, res, next) => {
  // call for passport authentication
  passport.authenticate('local', (err, user, info) => {
      // error from passport middleware
      if (err) return res.status(400).json(err);
      // registered user
      else if (user) return res.status(200).json({ "token": user.generateJwt() });
      // unknown user or wrong password
      else return res.status(404).json(info);
  })(req, res);
}

//user-edit
module.exports.userProfile = (req, res, next) =>{
  User.findOne({ _id: req._id },
      (err, user) => {
          if (!user)
              return res.status(404).json({ status: false, message: 'User record not found.' });
          else
              return res.status(200).json({ status: true, user : _.pick(user,['username','email']) });
      }
  );
}
