'use strict';

/**
 * Module dependencies
**/
var User = require('../users/user.model'),
  Meal = require('./meal.model'),
  errorHandler = require('../errors/errors.controller'),
  _ = require('lodash');

/**
 * Get the meals of user
 */
exports.index = function(req, res) {
  Meal.find({ user: req.user._id }).sort({ date: -1, time: -1 }).exec(function(err, meals) {
    if(err) return res.status(500).json({
      message: errorHandler.getErrorMessage(err)
    });

    return res.status(200).json(meals);
  });
};

/**
 * Get all meals
 */
exports.list = function(req, res) {
  Meal.find({}).sort({ date: -1, time: -1 }).populate('user', '-salt -password').exec(function(err, meals) {
    if(err) return res.status(500).json({
      message: errorHandler.getErrorMessage(err)
    });

    return res.status(200).json(meals);
  });
};

/**
 * Get a single meal
**/
exports.show = function(req, res) {
  var mealParams = { _id: req.params.id };
  if(req.user.role != 'admin') mealParams['user'] = req.user._id;

  Meal.findOne(mealParams, function(err, meal) {
    console.log(err);
    if(err) return res.status(500).json({
      message: errorHandler.getErrorMessage(err)
    });
    if(!meal) return res.sendStatus(404);

    return res.status(200).json(meal);
  });
};

/**
 * Create a new meal
**/
exports.create = function(req, res) {
  var newMeal = new Meal(req.body);
  if (req.user.role != 'admin') newMeal.user = req.user._id;
  if (!newMeal.user) return res.sendStatus(422);

  Meal.create(newMeal, function(err, meal) {
    if(err) return res.status(422).json({
      message: errorHandler.getErrorMessage(err)
    });

    return res.status(201).json(meal);
  });
};

/**
 * Update a meal
**/
exports.update = function(req, res) {
  var mealParams = _.omit(req.body, '_id');
  if(req.user.role == 'admin') {
    Meal.findById(req.params.id, function (err, meal) {
      if(err) return res.status(500).json({
        message: errorHandler.getErrorMessage(err)
      });
      if(!meal) return res.sendStatus(404);

      var updated = _.merge(meal, mealParams);
      updated.save(function (err) {
        if(err) return res.status(500).json({
          message: errorHandler.getErrorMessage(err)
        });

        return res.status(200).json(updated);
      });
    });
  } else {
    Meal.findOne({ user: req.user._id, _id: req.params.id }, function (err, meal) {
      if(err) return res.status(500).json({
        message: errorHandler.getErrorMessage(err)
      });
      if(!meal) return res.sendStatus(404);

      var updated = _.merge(meal, mealParams);
      updated.save(function (err) {
        if(err) return res.status(500).json({
          message: errorHandler.getErrorMessage(err)
        });

        return res.status(200).json(updated);
      });
    });
  }
};

/**
 * Delete a meal
**/
exports.destroy = function(req, res) {
  var mealParams = { _id: req.params.id };
  if(req.user.role != 'admin') mealParams['user'] = req.user._id;

  Meal.findOne(mealParams, function (err, meal) {
    if(err) return res.status(500).json({
      message: errorHandler.getErrorMessage(err)
    });
    if(!meal) return res.sendStatus(404);

    meal.remove(function(err) {
      if(err) return res.status(500).json({
        message: errorHandler.getErrorMessage(err)
      });

      return res.sendStatus(204);
    });
  });
};
