require('./passportConfig');
require('./config/config');
var express    = require('express');
var jwt        = require('jsonwebtoken');
var cors       = require('cors');
var passport   = require('passport');
var app        = express();
var port       = process.env.PORT || 8080;
var morgan     = require('morgan');
var mongoose   = require('mongoose');
mongoose.set('useCreateIndex', true);
var bodyParser = require('body-parser');
var router     = express.Router();
var appRoutes  = require('./app/routes/api')(router);
var path       = require('path');



/*const corsOptions = {
  origin: true,
  credentials: true
}

app.options('*', cors(corsOptions));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, NoAuth");
  next();
});*/
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public')); //per avere l'accesso alla cartella public

app.use('/api', appRoutes); // http://localhost:8080/api/altro

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
});

mongoose.connect('mongodb://localhost:27017/azienda',  {useNewUrlParser: true}, function(err){
    if(err){
        console.log('Not connected to the database ' + err);
    } else {
        console.log('Successfully connected to MongoDB');
    }
});

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})


app.listen(port, function(){
    console.log('Running the server on port ' + port);
});
