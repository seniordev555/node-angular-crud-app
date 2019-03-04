'use strict';

/**
 * Module dependencies.
**/
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  config = require('../../config/environment');

/**
 * Meal Schema
**/
var MealSchema = new Schema({
  date: {
    type: String,
    trim: true,
    default: '',
    required: [true, 'Date can not be blank.']
  },
  time: {
    type: String,
    trim: true,
    default: '',
    required: [true, 'Time can not be blank.'],
    match: [/^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/, 'Time is invalid format.']
  },
  text: {
    type: String,
    trim: true,
    default: '',
    required: [true, 'Text can not be blank.']
  },
  calories: {
    type: Number,
    required: [true, 'Calories can not be blank.']
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if(!dateString.match(regEx))
    return false;
  var d;
  if(!((d = new Date(dateString))|0))
    return false;
  return d.toISOString().slice(0,10) == dateString;
}

/**
 * Validators
**/

// Validates that calories is greater than 0.
MealSchema
  .path('calories')
  .validate(function(value) {
    return parseFloat(value) > 0;
}, 'Calories should be greater than 0.');

// Validates that date is valid.
MealSchema
  .path('date')
  .validate(function(value) {
    return isValidDate(value);
}, 'Date is invalid format.');


module.exports = mongoose.model('Meal', MealSchema);
