
// BASE SETUP
// ====================================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/MyDb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected to database");
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = process.env.port || 8080;
var Bear = require('./app/models/bear');

// ROUTES FOR OUR API
// ====================================================================
var router = express.Router();

router.use(function(req,res,next){
  // do logging
  console.log('Router is in use');
  next();
});

// A simple get request
router.get('/', function(req,res){
  res.json({message: 'Hooray! Welcomne to our api'});
});

router.route('/bears')
  // create a bear (accessed at POST http://localhost:8080/api/bears)
  .post(function(req,res){

      console.log('Received a post request for bears');
      var bear = new Bear({name : "Abhi"});  // create a new instance of bear models
      console.log('Created an intance of bear');
      bear.name = req.body.name;  // set the bears name (comes from the req)
      console.log('Extracted the name from the req : '+ bear.name);
      // save the bear and look for errors
      bear.save(function(err,res1){
        console.log('Saving result');
        if(err)
          res.send(err);
        res.json(bear);
      });
  })

  .get(function(req,res){
    Bear.find(function(err,bears){
      if(err)
        res.send(err);
      res.json(bears);
    });
  });


// on routes that end in /bears/:bear_id
//-----------------------------------------
  router.route('/bears/:bear_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req,res){
      Bear.findById(req.params.bear_id,function(err,bear){
        if(err)
          res.send(err);
        res.json(bear);
      });
    })

    // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
    .put(function(req,res){
      Bear.findById(req.params.bear_id,function(err,bear){
        if(err)
          res.send(err);
          console.log('Name:- '+ req.body.name);
          bear.name = req.body.name;
          bear.save(function(err){
            if(err)
              res.send(err);
            res.json(bear);
          });
      });
    })

    //delete the bear with this id (accessed at DELETE htttp://localhost:8080/api?bears/:bear_id)
    .delete(function(req,res){
      Bear.remove({
        _id: req.params.bear_id
      },function(err,bear){
        if(err)
          res.send(err);
        res.json({message: 'Successfully deleted'});
      });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
router.get('/a', function(req,res){
  cosole.log('Received a request for /a');
  res.json({message: 'This is a call to a'});
});


app.use('/api',router);

// START THE SERVER
// ====================================================================
app.listen(port);
console.log('Magic happens on port' + port);
