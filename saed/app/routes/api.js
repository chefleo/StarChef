var User = require("../models/user");
var Product = require("../models/product");
var Order = require("../models/order");
var jwt = require("jsonwebtoken");
const _ = require("lodash");
const multer = require("multer");

const ctrlUser = require("../../controller/user.controller");
const jwtHelper = require("../../controller/jwtHelper");

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/assets/pics/");
  },
  filename: function(req, file, callback) {
    callback(null, +new Date() + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    //reject a file
    cb(null, false);
  }
};

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

//var upload = multer({dest: 'uploads/'});

module.exports = function(router) {
  // http://localhost:8080/api/register
  router.post("/register", function(req, res) {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    if (
      req.body.username == null ||
      req.body.username == "" ||
      req.body.password == null ||
      req.body.password == "" ||
      req.body.email == null ||
      req.body.email == ""
    ) {
      res.send("Ensure username, email, and password were provided");
    } else {
      user.save(function(err) {
        if (err) {
          res.send("User or Email already exists!");
        } else {
          let payload = { subject: user._id };
          let token = jwt.sign(payload, "secretKey");
          console.log("user created");
          res.status(200).send({ token });
        }
      });
    }
  });
  // http://localhost:8080/api/login
  router.post("/login", ctrlUser.authenticate);
  // http://localhost:8080/api/user-edit
  router.get("/user-edit", jwtHelper.verifyJwtToken, ctrlUser.userProfile);
  router.post("/user-edit", upload.single("file"), function(req, res) {
    console.log(req.file);
    var product = new Product();
    product.image = "assets/pics/" + req.file.filename;
    product.person_id = req.body.person_id;
    product.name = req.body.name;
    product.description = req.body.description;
    product.category = req.body.category;
    product.price = req.body.price;
    if (
      req.body.person_id == null ||
      req.body.name == null ||
      req.body.name == "" ||
      req.body.description == null ||
      req.body.description == "" ||
      isNaN(req.body.price)
    ) {
      res.send("Ensure name, description and price were provided");
    } else {
      if (!req.file) {
        console.log("Please load file");
        res.status(400).send("Error file");
      } else {
        product.save(function(err) {
          if (err) {
            res.send(err);
          } else {
            //console.log(req.file);
            console.log("Profile image uploaded");
            res.send(req.file);
          }
        });
        //res.send('product save');
      }
    }
  });
  router.put("/user-edit", function(req, res) {
    var user = new User();
    user._id = req.body._id;
    User.findByIdAndUpdate({ _id: user._id }, req.body).then(function() {
      User.findOne({ _id: user._id }).then(function(user) {
        user.save(function(err) {
          if (err) {
            res.send("User or Email already exists!");
          } else {
            res.send(user);
          }
        });
      });
    });
  });
  router.delete("/user-edit/product/:id", function(req, res) {
    const requestId = req.params.id;
    Product.findByIdAndRemove(requestId, (err, data) => {
      if (err) {
        console.log("Err delete");
      } else {
        res.send("Delete");
      }
    });
  });
  router.get("/home", jwtHelper.verifyJwtTokenHome, function(req, res) {
    let user = new User({
      _id: req._id
    });
    Product.find({}, (err, product) => {
      if (!product) {
        console.log("errore");
      } else {
        //console.log(product);
        console.log(user);
        res.status(200).json({
          status: true,
          user,
          product
        });
      }
    });
  });
  router.post("/home", function(req, res) {
    console.log(req.body);
    Product.findById(req.body.productId)
      .then(product => {
        let order = new Order({
          userId: req.body.userId,
          product: req.body.productId,
          quantity: req.body.quantity
        });
        console.log(order);
        return order.save();
      })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Order stored",
          createdOrder: {
            _id: result._id,
            userId: result.userId,
            product: result.product,
            quantity: result.quantity
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Product not found",
          error: err
        });
      });
  });

  router.get("/user-edit/orders", jwtHelper.verifyJwtTokenHome, function(
    req,
    res
  ) {
    let user = new User({
      _id: req._id
    });
    let order = new Order();
    console.log(user);
    Order.find({ userId: user._id })
      .select("product, quantity")
      .populate("product", "name price")
      .then(order => {
        res.status(201).json({
          status: true,
          order
        });
      });
  });

  router.get(
    "/user-edit/orders/payment",
    jwtHelper.verifyJwtTokenHome,
    function(req, res) {
      let user = new User({
        _id: req._id
      });
      let order = new Order();
      console.log(user);
      Order.deleteMany({ userId: user._id }).then(order => {
        res.status(201).json("Delete Orders");
      });
    }
  );

  router.delete("/user-edit/orders/:id", function(req, res) {
    const requestId = req.params.id;
    Order.findByIdAndRemove(requestId, (err, data) => {
      if (err) {
        console.log("Err delete");
      } else {
        res.send("Delete");
      }
    });
  });

  return router;
};
