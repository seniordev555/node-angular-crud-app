'use strict';

/**
 * Module dependencies.
 */
var config = require('./config/environment'),
  mongoose = require('mongoose'),
  express = require('./config/express'),
  chalk = require('chalk');

var conn = mongoose.connect(config.mongo.uri, config.mongo.options, function(err) {
  if(err) {
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(chalk.red(err))
  } else {
    if(config.seed) {
      require('./seed')(conn);
    }
  }
});

// Init the express application
var app = express();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Calorie application started on port ' + config.port);
