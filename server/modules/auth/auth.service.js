'use strict';

/**
 * Module dependencies
**/
var passport = require('passport'),
  config = require('../../config/environment'),
  jwt = require('jsonwebtoken'),
  compose = require('composable-middleware');

/**
 * Generate jwt token
 */
exports.generateToken = function(id, role) {
  return jwt.sign({ _id: id, role: role }, config.jwtSecret, { expiresIn: 24*60*60 });
};

/**
 * Check the JWT authorization header
 */
exports.isAuthenticated = function() {
  return passport.authenticate('jwt', config.jwtSession);
};

/**
 * Checks if the user role meets the minimum requirements of the route
 */
exports.hasRole = function(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set.');

  return compose()
    .use(this.isAuthenticated())
    .use(function (req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.sendStatus(403);
      }
    });
}
