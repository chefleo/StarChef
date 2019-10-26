const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = require('../app/models/user');
const Product = require('../app/models/product');

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
module.exports.userProfile = (req, res, next) => {
  let cust = new User;
  cust._id = req._id;
  var prod = new Product;

  //let customer;

  User.findOne({ _id: cust._id },
      (err, user) => {

          if (!user) {
            return res.status(404).json({ status: false, message: 'User record not found.' });
          } else {
            //return res.status(200).json({ status: true, user : _.pick(user,['_id','username','email']) });
            //return res.write(JSON.stringify({user : _.pick(user,['_id','username','email'])}));
            console.log('preso');
            cust = _.pick(user,['_id','username','email']);

            Product.find({ person_id: cust._id },
              (err, product) => {
                if(!product){
                  //res.write({user : _.pick(user,['_id','username','email'])});
                  //res.write('send data2');
                  //return res.end();
                } else {
                  //prod = _.pick(product,['person_id','name','description','price']);
                  //console.log(product);
                  console.log(cust);
                  return res.status(200).json({
                    status: true,
                    cust,
                    product
                  })
              }
            })
          }
        }

   );
   /*Product.find({ person_id: cust._id },
    (err, product) => {
      if(!product){
        //res.write({user : _.pick(user,['_id','username','email'])});
        //res.write('send data2');
        //return res.end();
      } else {
        //prod = _.pick(product,['person_id','name','description','price']);
        //console.log(product);
        console.log(cust);
        return res.status(200).json({
          status: true,
          cust,
          product
        })
    }
  })*/
}
//res.write(JSON.stringify({product : _.pick(product,['person_id','name','description','price'])}));
        //res.write('send data');
        //console.log('data');
        //console.log(product);
        //return res.end();

//res.write({user : _.pick(user,['_id','username','email'])});
//return res.status(200).json({status: true,product,user : _.pick(user,['_id','username','email']) })
//return cust = _.pick(user,['_id','username','email']);
