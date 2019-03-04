'use strict';

/**
 * Module dependencies
**/
var express = require('express'),
  controller = require('./users.controller'),
  auth = require('../auth/auth.service'),
  router = express.Router();

/**
 * Non-authenticated routes
**/
// Register a new user
router.post('/', controller.create);

/**
 * User authenticated routes
**/
// Get the user's own profile
router.get('/profile', auth.isAuthenticated(), controller.me);

// Update the user's own profile
router.put('/profile', auth.isAuthenticated(), controller.updateProfile);

// Update the user's own password
router.put('/password', auth.isAuthenticated(), controller.updatePassword);

/**
 * Manager, Admin routes
**/
// Get the list of users
router.get('/', auth.hasRole('manager'), controller.index);

// Create a new user
router.post('/new', auth.hasRole('manager'), controller.createUser);

// Get the profile of specific user
router.get('/:id', auth.hasRole('manager'), controller.show);

// Update the profile of specific user
router.put('/:id', auth.hasRole('manager'), controller.update);

// Update the password of specific user
router.put('/password/:id', auth.hasRole('manager'), controller.updateUserPassword);

// Delete a user
router.delete('/:id', auth.hasRole('manager'), controller.destroy);

module.exports = router;
