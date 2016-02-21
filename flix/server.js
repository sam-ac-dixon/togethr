// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dev-lab'); // connect to our database

var Script     = require('./app/models/script');
var Rest       = require('./app/utils/rest');
var qs         = require('querystring');

var options = {
    host: 'www.omdbapi.com',
    method: 'GET'
};


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/findMovies/:title')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        options.path = "/?" + qs.stringify({ t: req.params.title});
        Rest.getJSON(options, function(statusCode, result)
          {
              res.statusCode = statusCode;
              res.send(result);
          });
    });

router.route('/script')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var script = new Script();      // create a new instance of the Bear model
        script.name = req.body.name
        script.code = req.body.code;  // set the bears name (comes from the request)

        // save the bear and check for errors
        script.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Script saved successfully' });
        });

    })

    .get(function(req, res) {
        Script.find(function(err, scripts) {
            if (err)
                res.send(err);

            res.json(scripts);
        });
    });
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
