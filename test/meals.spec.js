var config = require('../server/config/environment'),
  jwt = require('jsonwebtoken'),
  chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../server'),
  expect = chai.expect,
  User = require('../server/modules/users/user.model'),
  Meal = require('../server/modules/meals/meal.model');

chai.use(chaiHttp);

var params, user1, manager1, admin1, user1_token, manager1_token, admin1_token;

describe('API functional testing - Meals', function() {

  before(function(done) {
    var user_data = [ { name: 'User 1', email: 'user1@calorie.com', password: 'passw0rd', caloriesPerDay: 100 },
                  { name: 'Manager 1', email: 'manager1@calorie.com', password: 'passw0rd', role: 'manager', caloriesPerDay: 100 },
                  { name: 'Admin 1', email: 'admin1@calorie.com', password: 'passw0rd', role: 'admin', caloriesPerDay: 100 } ];
    User.create(user_data, function(err, users) {
      user1 = users[0];
      manager1 = users[1];
      admin1 = users[2];
      user1_token = jwt.sign({ _id: user1._id, role: user1.role }, config.jwtSecret, { expiresIn: 24*60*60 });
      manager1_token = jwt.sign({ _id: manager1._id, role: manager1.role }, config.jwtSecret, { expiresIn: 24*60*60 });
      admin1_token = jwt.sign({ _id: admin1._id, role: admin1.role }, config.jwtSecret, { expiresIn: 24*60*60 });

      var meal_data = [];
      for(var user of users) {
        for(var info of [['07:00', 'breakfast'], ['13:00', 'lunch'], ['20:00', 'dinner']]) {
          meal_data.push({ date: '2017-07-20', time: info[0], text: info[1], calories: 30, user: user._id });
        }
      }

      Meal.create(meal_data, function(err, meals) {
        done();
      });
    });
  });

  after(function(done) {
    User.collection.drop();
    Meal.collection.drop();
    done();
  });

  describe('Get the meals of user - /api/meals', function() {
    it('should be 200 with a token', function(done) {
      chai.request(server)
      .get('/api/meals')
      .set('Authorization', 'JWT ' + user1_token)
      .end(function(err, res) {
        expect(res.status).to.eq(200);
        Meal.count({ user: user1._id }, function(err, count) {
          expect(res.body.length).to.eq(count);
          done();
        });
      });
    });

    it('should be 401 without token', function(done) {
      chai.request(server)
      .get('/api/meals')
      .end(function(err, res) {
        expect(res.status).to.eq(401);
        done();
      });
    });
  });

  describe('Get all meals - /api/meals/all', function() {
    it('should be 401 if user is getting all meals', function(done) {
      chai.request(server)
      .get('/api/meals/all')
      .set('Authorization', 'JWT ' + user1_token)
      .end(function(err, res) {
        expect(res.status).to.eq(403);
        done();
      });
    });

    it('should be 401 if manager is getting all meals', function(done) {
      chai.request(server)
      .get('/api/meals/all')
      .set('Authorization', 'JWT ' + manager1_token)
      .end(function(err, res) {
        expect(res.status).to.eq(403);
        done();
      });
    });

    it('should be 200 if admin is getting all meals', function(done) {
      chai.request(server)
      .get('/api/meals/all')
      .set('Authorization', 'JWT ' + admin1_token)
      .end(function(err, res) {
        expect(res.status).to.eq(200);
        Meal.count({}, function(err, count) {
          expect(res.body.length).to.eq(count);
          done();
        });
      });
    });
  });

  describe('Get a single meal - /api/meals/:id', function(done) {
    it('should be 200 if user is getting a meal', function(done) {
      Meal.find({ user: user1._id }, function(err, meals) {
        var id = meals[0]._id;
        chai.request(server)
        .get('/api/meals/' + id)
        .set('Authorization', 'JWT ' + user1_token)
        .end(function(err, res) {
          expect(res.status).to.eq(200);
          expect(res.body._id.toString()).to.eq(id.toString());
          done();
        });
      });
    });

    it('should be 404 if user is getting other user\'s meal', function(done) {
      Meal.find({ user: manager1._id }, function(err, meals) {
        var id = meals[0]._id;
        chai.request(server)
        .get('/api/meals/' + id)
        .set('Authorization', 'JWT ' + user1_token)
        .end(function(err, res) {
          expect(res.status).to.eq(404);
          done();
        });
      });
    });

    it('should be 200 if admin is getting other user\'s meal', function(done) {
      Meal.find({ user: manager1._id }, function(err, meals) {
        var id = meals[0]._id;
        chai.request(server)
        .get('/api/meals/' + id)
        .set('Authorization', 'JWT ' + admin1_token)
        .end(function(err, res) {
          expect(res.status).to.eq(200);
          expect(res.body._id.toString()).to.eq(id.toString());
          done();
        });
      });
    });
  });

  describe('Create a meal - /api/meals', function() {
    it('should be 422 with invalid data', function(done) {
      params = { date: '2017-7-1', time: '7:0', text: '', calories: 0 };
      chai.request(server)
      .post('/api/meals')
      .set('Authorization', 'JWT ' + user1_token)
      .send(params)
      .end(function(err, res) {
        expect(res.status).to.eq(422);
        done();
      });
    });

    it('should be 201 with correct data', function(done) {
      params = { date: '2017-07-21', time: '07:00', text: 'breakfast', calories: 30 };
      chai.request(server)
      .post('/api/meals')
      .set('Authorization', 'JWT ' + user1_token)
      .send(params)
      .end(function(err, res) {
        expect(res.status).to.eq(201);
        expect(res.body.user.toString()).to.eq(user1._id.toString());
        done();
      });
    });
  });

  describe('Update a meal - /api/meals/:id', function() {
    it('should be 200 if user is updating his meal', function(done) {
      Meal.find({ user: user1._id }, function(err, meals) {
        var id = meals[0]._id;
        chai.request(server)
        .put('/api/meals/' + id)
        .set('Authorization', 'JWT ' + user1_token)
        .send({ text: 'text changed' })
        .end(function(err, res) {
          expect(res.status).to.eq(200);
          expect(res.body.text).to.eq('text changed');
          done();
        });
      });
    });

    it('should be 404 if user is updating other meal', function(done) {
      Meal.find({ user: manager1._id }, function(err, meals) {
        var id = meals[0]._id;
        chai.request(server)
        .put('/api/meals/' + id)
        .set('Authorization', 'JWT ' + user1_token)
        .send({ text: 'text changed' })
        .end(function(err, res) {
          expect(res.status).to.eq(404);
          done();
        });
      });
    });

    it('should be 200 if admin is updating other meal', function(done) {
      Meal.find({ user: manager1._id }, function(err, meals) {
        var id = meals[0]._id;
        chai.request(server)
        .put('/api/meals/' + id)
        .set('Authorization', 'JWT ' + admin1_token)
        .send({ text: 'text changed' })
        .end(function(err, res) {
          expect(res.status).to.eq(200);
          expect(res.body.text).to.eq('text changed');
          done();
        });
      });
    });
  });

  describe('Delete a meal - /api/meals/:id', function() {
    it('should be 204 if user is deleting his meal', function(done) {
      Meal.find({ user: user1._id }, function(err, meals) {
        var id = meals[0]._id;
        chai.request(server)
        .delete('/api/meals/' + id)
        .set('Authorization', 'JWT ' + user1_token)
        .end(function(err, res) {
          expect(res.status).to.eq(204);
          Meal.count({ _id: id }, function(err, count) {
            expect(count).to.eq(0);
            done();
          });
        });
      });
    });

    it('should be 404 if user is deleting other meal', function(done) {
      Meal.find({ user: manager1._id }, function(err, meals) {
        var id = meals[0]._id;
        chai.request(server)
        .delete('/api/meals/' + id)
        .set('Authorization', 'JWT ' + user1_token)
        .end(function(err, res) {
          expect(res.status).to.eq(404);
          done();
        });
      });
    });

    it('should be 204 if admin is deleting other meal', function(done) {
      Meal.find({ user: user1._id }, function(err, meals) {
        var id = meals[0]._id;
        chai.request(server)
        .delete('/api/meals/' + id)
        .set('Authorization', 'JWT ' + admin1_token)
        .end(function(err, res) {
          expect(res.status).to.eq(204);
          Meal.count({ _id: id }, function(err, count) {
            expect(count).to.eq(0);
            done();
          });
        });
      });
    });
  });
});
