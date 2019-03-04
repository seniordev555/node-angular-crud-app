'use strict';

/**
 * Module dependencies
**/
var express = require('express'),
  controller = require('./meals.controller'),
  auth = require('../auth/auth.service'),
  router = express.Router();

/**
 * User authenticated routes
**/

// Get the meals by user
router.get('/', auth.isAuthenticated(), controller.index);

// Get all meals
router.get('/all', auth.hasRole('admin'), controller.list);

// Get the single meal
router.get('/:id', auth.isAuthenticated(), controller.show);

// Create a new meal
router.post('/', auth.isAuthenticated(), controller.create);

// Update a meal
router.put('/:id', auth.isAuthenticated(), controller.update);

// Delete a meal
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
