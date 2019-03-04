'use strict';

var _ = require('lodash'),
  path = require('path');

var defaultConfig = {
  env: process.env.NODE_ENV || 'development',

  // Server port
  port: process.env.PORT || 8000,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Secret for session, you will want to change this and make it an environment variable
  jwtSecret: 'K@!s3cr3tK3Y',
  jwtSession: { session: false },

  // List of user roles
  userRoles: ['user', 'manager', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      },
    }
  },

  // Seed db
  seed: process.env.SEED || false
};

// Export the config object based on the NODE_ENV
module.exports = _.merge(
  defaultConfig,
  require('./' + defaultConfig.env + '.js') || {});
