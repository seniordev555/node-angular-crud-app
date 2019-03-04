'use strict';

/**
 * Module dependencies
**/
var User = require('../users/user.model'),
  errorHandler = require('../errors/errors.controller'),
  auth = require('./auth.service');

exports.authenticate = function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if(err) return res.status(401).json({
      message: errorHandler.getErrorMessage(err)
    });
    if(!user) return res.status(404).json({ message: 'Something went wrong, please try again.'});
    if(!user.authenticate(req.body.password)) return res.status(401).json({ message: 'The credentials are incorrect.'});

    var token = auth.generateToken(user._id, user.role);
    res.json({ token: token });
  });
};
