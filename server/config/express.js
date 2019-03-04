'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
  http = require('http'),
  morgan = require('morgan'),
  compression = require('compression'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  path = require('path'),
  passport = require('passport'),
  config = require('./environment');

module.exports = function() {
  // Initialize express app
  var app = express();

  // Set views and view engine
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.set('views', config.root + '/server/views');

  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(morgan('dev'));

  // CORS middleware
  app.use(function(req, res, next) {
    // CORS header
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,Authorization');
    if (req.method == 'OPTIONS') {
      res.status(200).end();
    } else {
      next();
    }
  });

  require('../routes')(app);

  return app;
};
