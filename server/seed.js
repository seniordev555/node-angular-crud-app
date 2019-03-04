'use strict';

/**
 * Module dependencies
**/
var User = require('./modules/users/user.model'),
  Meal = require('./modules/meals/meal.model');

module.exports = function(conn) {
  conn.connection.db.dropDatabase();

  User.create(
    {
      name: 'admin',
      email: 'admin@calorie.com',
      role: 'admin',
      password: 'passw0rd',
      caloriesPerDay: 100
    }, {
      name: 'manager',
      email: 'manager@calorie.com',
      role: 'manager',
      password: 'passw0rd',
      caloriesPerDay: 100
    }, {
      name: 'user',
      email: 'user@calorie.com',
      role: 'user',
      password: 'passw0rd',
      caloriesPerDay: 100
    }, function() {
      console.log('Finished populating users.');

      User.findOne({email: 'user@calorie.com'}, function(err, user) {
        if (err) {
          console.log('Something is wrong!');
        } else {
          Meal.create(
            {
              date: '2017-07-01',
              time: '05:34',
              text: 'breakfast',
              calories: 50,
              user: user._id
            }, {
              date: '2017-07-01',
              time: '12:34',
              text: 'lunch',
              calories: 50,
              user: user._id
            }, {
              date: '2017-07-01',
              time: '19:34',
              text: 'dinner',
              calories: 50,
              user: user._id
            }, {
              date: '2017-07-02',
              time: '05:34',
              text: 'breakfast',
              calories: 50,
              user: user._id
            }, {
              date: '2017-07-02',
              time: '12:34',
              text: 'lunch',
              calories: 50,
              user: user._id
            }, {
              date: '2017-07-02',
              time: '19:34',
              text: 'dinner',
              calories: 50,
              user: user._id
            }, {
              date: '2017-07-03',
              time: '05:34',
              text: 'breakfast',
              calories: 30,
              user: user._id
            }, {
              date: '2017-07-03',
              time: '12:34',
              text: 'lunch',
              calories: 30,
              user: user._id
            }, {
              date: '2017-07-03',
              time: '19:34',
              text: 'dinner',
              calories: 30,
              user: user._id
            }, function() {
              console.log('Finished populating meals.');
            }
          );
        }
      });
    }
  );
};
