'use strict';

// Test environment
module.exports = {
  // Secret for session, you will want to change this and make it an environment variable
  jwtSecret: 'Test@123',

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost:27017/calorie-app-test'
  }
};
