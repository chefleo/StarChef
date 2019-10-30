var User       = require('../models/user');
var Product    = require('../models/product');
var jwt        = require('jsonwebtoken');
const _ = require('lodash');
const multer   = require('multer');

const ctrlUser = require('../../controller/user.controller');
const jwtHelper = require('../../controller/jwtHelper');
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './uploads/');
  },
  filename: function(req, file, callback) {
    callback(null, new Date().toISOString() + file.originalname );
  }
});

const fileFilter = (req, file, cb) => {

    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
      cb(null, true);
    } else {
      //reject a file
      cb(null, false);
    }
}

var upload = multer({
  storage: storage,
  limits:{
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


//var upload = multer({dest: 'uploads/'});

module.exports = function(router) {
    // http://localhost:8080/api/register
        router.post('/register', function(req, res) {
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
                  let payload = { subject: user._id };
                  let token = jwt.sign(payload, 'secretKey');
                  console.log('user created');
                  res.status(200).send({token});
              }
            });
          }
        });

      // http://localhost:8080/api/login
      router.post('/login', ctrlUser.authenticate);

      // http://localhost:8080/api/user-edit
      router.get('/user-edit', jwtHelper.verifyJwtToken, ctrlUser.userProfile);
      router.post('/user-edit', upload.single('file'), function(req,res) {

        console.log(req.file);
        var product = new Product();
        product.image = req.file.path;
        product.person_id = req.body.person_id;
        product.name = req.body.name;
        product.description = req.body.description;
        product.category = req.body.category;
        product.price  = req.body.price;
        if(req.body.person_id == null ||
           req.body.name == null ||
           req.body.name == '' ||
           req.body.description == null ||
           req.body.description == ''||
           isNaN(req.body.price) ){
            res.send('Ensure name, description and price were provided');
          } else {
            if(!req.file){
              console.log('Please load file');
              res.status(400).send('Error file');
            } else {
              product.save(function(err){
                if(err){
                    res.send(err);
                } else {
                    //console.log(req.file);
                    console.log('Profile image uploaded');
                    res.send(req.file);
                }
              });
              //res.send('product save');
            }
          }
      });
      router.put('/user-edit', function(req, res) {
        var user = new User;
        user._id = req.body._id;
        User.findByIdAndUpdate({_id: user._id}, req.body).then(function() {
          User.findOne({_id: user._id}).then(function(user) {
            user.save( function(err){
              if(err){
                  res.send('User or Email already exists!');
              } else {
                res.send(user);
              }
            });
          })
        })
      })

      router.get('/home', function(req, res) {
        Product.find({},
          (err, product) => {
            if(!product){
              console.log('errore');
            } else {
              //console.log(product);
              res.status(200).json({
                status: true,
                product
              })
            }
          })
      })



    return router;
}
