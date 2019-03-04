'use strict';

/**
* Module dependencies
**/
var express = require('express'),
  config = require('../../config/environment'),
  User = require('../users/user.model'),
  controller = require('./auth.controller'),
  router = express.Router();

// Passport Configuration
require('./passport').setup(User, config);

router.post('/', controller.authenticate);

module.exports = router;
