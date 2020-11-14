var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

var UserSchema = new Schema({
    username: {type: String, lowercase: true, required: true, unique: true},
    email: {type: String, lowercase: true, required: true, unique: true},
    password: {type: String, required: true},
});

UserSchema.pre('save', function(next){
    var user = this;
    //per criptare la password
    bcrypt.hash(user.password, null, null, function(err, hash){
        if(err) return next(err);
        user.password = hash;
        next();
    });
});

UserSchema.methods.validPassword = function(password){
  var user = this;
  return bcrypt.compareSync(password, user.password);
}

UserSchema.methods.generateJwt = function () {
  return jwt.sign({ _id: this._id},
    process.env.JWT_SECRET,
  {
      expiresIn: process.env.JWT_EXP
  });
}

module.exports = mongoose.model('User', UserSchema);
