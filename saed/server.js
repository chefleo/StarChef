var express    = require('express');
var app        = express();
var port       = process.env.PORT || 8080;
var morgan     = require('morgan');
var mongoose   = require('mongoose');
mongoose.set('useCreateIndex', true);
var bodyParser = require('body-parser');
var router     = express.Router();
var appRoutes  = require('./app/routes/api')(router);
var path       = require('path');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true})); // for parsing application/x-www-form-urlencoded
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public')); //per avere l'accesso alla cartella public

app.use('/api', appRoutes); // http://localhost:8080/api/altro

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
