'use strict';

/**
 * Module dependencies.
**/
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  config = require('../../config/environment'),
  Meal = require('../meals/meal.model');

/**
 * User Schema
**/
var UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    default: '',
    required: [true, 'Name can not be blank.']
  },
  email: {
    type: String,
    trim: true,
    default: '',
    required: [true, 'Email can not be blank.'],
    match: [/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, 'Email is not a valid address.']
  },
  password: {
    type: String,
    default: '',
    required: [true, 'Password can not be blank.'],
    minlength: [6, 'Password should be longer than 5.']
  },
  role: {
    type: String,
    enum: config.userRoles,
    default: 'user'
  },
  caloriesPerDay: {
    type: Number,
    required: [true, 'Calories can not be blank.']
  },
  salt: String,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Validators
**/

// Validate that email is registered
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'Email address is already registered.');

// Validates that calories is greater than 0.
UserSchema
  .path('caloriesPerDay')
  .validate(function(value) {
    return parseFloat(value) > 0;
}, 'Calories should be greater than 0.');

/**
 * Pre-save hook
**/
UserSchema.pre('save', function(next) {
  if(this.password && this.password.length > 6) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

UserSchema.pre('remove', function(next) {
  Meal.remove({ user: this._id }).exec();

  next();
});

/**
 * Methods
**/
UserSchema.methods.hashPassword = function(password) {
  if(this.salt && password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
  } else {
    return password;
  }
};

UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

module.exports = mongoose.model('User', UserSchema);
