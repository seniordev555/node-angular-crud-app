'use strict';

/**
 * Module dependencies
**/
var User = require('./user.model'),
  errorHandler = require('../errors/errors.controller'),
  _ = require('lodash');

/**
 * Get the profile of current user
 */
exports.me = function(req, res) {
  var userId = req.user._id;

  User.findById(userId, '-salt -password', function(err, user) {
    if(err) return res.status(422).json({
      message: errorHandler.getErrorMessage(err)
    });
    if(!user) return res.sendStatus(404);

    res.json(user);
  });
};

/**
 * Create a new user
**/
exports.create = function(req, res) {
  var newUser = new User(req.body);

  newUser.save(function(err, user) {
    if(err) return res.status(422).json({
      message: errorHandler.getErrorMessage(err)
    });
    var saved = _.omit(user, ['_id', 'password', 'salt']);
    res.status(201).json(saved);
  });
};

/**
 * Update the profile of current user
**/
exports.updateProfile = function(req, res) {
  var userId = req.user._id;
  var userParams = _.omit(req.body, ['_id', 'password', 'role']);

  User.findById(userId, '-salt -password', function(err, user) {
    if(err) return res.status(500).json({
      message: errorHandler.getErrorMessage(err)
    });
    if(!user) return res.json(404);

    var updated = _.merge(user, userParams);
    updated.save(function (err) {
      if(err) return res.status(422).json(err);

      return res.status(200).json(updated);
    });
  });
};

/**
 * Update the password of current user
**/
exports.updatePassword = function(req, res) {
  var userId = req.user._id;
  var oldPassword = req.body.oldPassword, newPassword = req.body.newPassword;

  User.findById(userId, function(err, user) {
    if(user.authenticate(oldPassword)) {
      user.password = newPassword;

      user.save(function(err) {
        if(err) return res.status(422).json({
          message: errorHandler.getErrorMessage(err)
        });
        res.status(200).json({message: 'Password changed successfully.'});
      });
    } else {
      res.status(403).json({message: 'Old password is not matched.'});
    }
  });
};

/**
 * Get the list of users
**/
exports.index = function(req, res) {
  var userParams = {};
  if(req.user.role == 'manager')
    userParams = { role: 'user' };
  User.find(userParams, '-salt -password', function (err, users) {
    if(err) return res.status(500).json({
      message: errorHandler.getErrorMessage(err)
    });
    res.status(200).json(users);
  });
};

/**
 * Create a new user by manager or admin
**/
exports.createUser = function(req, res) {
  var newUser = new User(req.body);
  if(req.user.role == 'manager' && req.body.role && req.body.role != 'user')
    return res.status(403).json({
      message: 'This user cannot create this role: ' + req.body.role
    });

  newUser.save(function(err, user) {
    if(err) return res.status(422).json({
      message: errorHandler.getErrorMessage(err)
    });

    var saved = _.omit(user, ['salt', 'password']);
    res.status(201).json(saved);
  });
}

/**
 * Get a single user
**/
exports.show = function(req, res) {
  var userId = req.params.id;

  User.findById(userId, '-salt -password', function (err, user) {
    if(err) return res.status(500).json({
      message: errorHandler.getErrorMessage(err)
    });
    if (!user) return res.sendStatus(404);
    if(req.user.role == 'manager' && user.role != 'user')
      return res.status(403).json({
        message: 'User has no permission'
      });

    res.json(user);
  });
}

/**
 * Update a single user
**/
exports.update = function(req, res) {
  var userId = req.params.id;
  var userParams = _.omit(req.body, ['_id', 'password']);

  User.findById(userId, '-salt -password', function (err, user) {
    if(err) return res.status(500).json({
      message: errorHandler.getErrorMessage(err)
    });
    if(!user) return res.sendStatus(404);
    if(req.user.role == 'manager' && user.role != 'user')
      return res.status(403).json({
        message: 'User has no permission'
      });

    var updated = _.merge(user, userParams);
    updated.save(function (err) {
      if(err) return res.status(422).json({
        message: errorHandler.getErrorMessage(err)
      });

      return res.status(200).json(updated);
    });
  });
};

/**
 * Update the password of single user
**/
exports.updateUserPassword = function(req, res, next) {
  var userId = req.params.id;
  var oldPassword = req.body.oldPassword, newPassword = req.body.newPassword;

  User.findById(userId, function(err, user) {
    if(err) return res.status(500).json({
      message: errorHandler.getErrorMessage(err)
    });
    if(!user) return res.sendStatus(404);
    if(req.user.role == 'manager' && user.role != 'user')
      return res.status(403).json({
        message: 'User has no permission'
      });
    if(user.authenticate(oldPassword)) {
      user.password = newPassword;

      user.save(function(err) {
        if(err) return res.status(422).json({
          message: errorHandler.getErrorMessage(err)
        });
        res.status(200).json({message: 'Password changed successfully.'});
      });
    } else {
      res.status(422).json({message: 'Your password is not matched.'});
    }
  });
};

/**
 * Delete a user
**/
exports.destroy = function(req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function(err, user){
    if(err) return res.status(500).json({
      message: errorHandler.getErrorMessage(err)
    });
    if (!user) return res.sendStatus(404);
    if(req.user.role == 'manager' && user.role != 'user')
      return res.status(403).json({
        message: 'User has no permission'
      });
    if(req.user._id == userId) {
      return res.status(403).json({
        message: 'User has no permission'
      });
    }

    user.remove(function(){
      return res.sendStatus(204);
    });
  });
};
