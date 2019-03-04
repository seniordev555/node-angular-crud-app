'use strict';

/**
 * Module dependencies
**/
var passport = require('passport'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt  = require('passport-jwt').ExtractJwt;

exports.setup = function (User, config) {
  passport.use(
    new JwtStrategy({
      secretOrKey: config.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeader()
    },

    function(payload, done) {
      User.findOne({ _id: payload._id }, function(err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    }
  ));
};
