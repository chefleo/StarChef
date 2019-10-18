var User       = require('../models/user');
var Product    = require('../models/product');

module.exports = function(router) {
    // http://localhost:8080/api/register
        router.post('/register', function(req,res) {
          var user = new User();
          user.username = req.body.username;
          user.password = req.body.password;
          user.email    = req.body.email;
          if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == ''||req.body.email == null || req.body.email == ''){
              res.send('Ensure username, email, and password were provided')
          } else {
              user.save(function(err){
              if(err){
                  res.send('User or Email already exists!');
              } else {
                  res.send('user created');
              }
            });
          }
        });

      router.post('/home', function(req,res) {
        var product = new Product();
        product.name = req.body.name;
        product.description = req.body.description;
        product.price  = req.body.price;
        if(req.body.name == null ||
           req.body.name == '' ||
           req.body.description == null ||
           req.body.description == ''||
           isNaN(req.body.price) ){
            res.send('Ensure name, description and price were provided');
          } else {
            product.save(function(err){
              if(err){
                  res.send(err);
              } else {
                  res.send('product created');
              }
            });
            //res.send('product save');
        }
      });



    return router;
}
