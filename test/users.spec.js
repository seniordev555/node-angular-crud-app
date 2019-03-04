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

describe('API functional testing - Users', function() {

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

  describe('Sign up - /api/users', function() {
    params = { name: 'user2', email: 'user2@calorie.com', password: 'passw0rd', caloriesPerDay: 100 };
    it('should return 200 if registering a new user', function(done) {
      chai.request(server)
      .post('/api/users')
      .send(params)
      .end(function(err, res) {
        expect(res.status).to.eq(201);
        expect(res.body.email).to.eq(params.email);
        done();
      });
    });

    it('should return 422 if registering a new user with duplicated email', function(done) {
      chai.request(server)
      .post('/api/users')
      .send(params)
      .end(function(err, res) {
        expect(res.status).to.eq(422);
        done();
      });
    });

    it('should return 422 if registering a new user with zero calorie', function(done) {
      params = { name: 'user2', email: 'user1@calorie.com', password: 'passw0rd', caloriesPerDay: 0 };
      chai.request(server)
      .post('/api/users')
      .send(params)
      .end(function(err, res) {
        expect(res.status).to.eq(422);
        done();
      });
    });
  });

  describe('Log in - /api/authenticate', function() {
    it('should return 200 if loggig in as an existing user', function(done) {
      params = { email: 'user1@calorie.com', password: 'passw0rd' };
      chai.request(server)
      .post('/api/authenticate')
      .send(params)
      .end(function(err, res) {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.be.a('object');
        expect(res.body).to.have.property('token');
        done();
      });
    });

    it('should return 401 if loggig in with invalid email address', function(done) {
      params = { email: 'invalid@calorie.com', password: 'passw0rd' };
      chai.request(server)
      .post('/api/authenticate')
      .send(params)
      .end(function(err, res) {
        expect(res.status).to.eq(404);
        done();
      });
    });

    it('should return 401 if loggig in with invalid password', function(done) {
      params = { email: 'user1@calorie.com', password: 'password' };
      chai.request(server)
      .post('/api/authenticate')
      .send(params)
      .end(function(err, res) {
        expect(res.status).to.eq(401);
        done();
      });
    });
  });

  describe('Get Profile - /api/users/profile', function() {
    it('should return 401 without token', function(done) {
      chai.request(server)
      .get('/api/users/profile')
      .end(function(err, res) {
        expect(res.status).to.eq(401);
        done();
      });
    });

    it('should return 200 with token provided', function(done) {
      chai.request(server)
      .get('/api/users/profile')
      .set('Authorization', 'JWT ' + user1_token)
      .end(function(err, res) {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.be.a('object');
        expect(res.body.email).to.eq(user1.email);
        done();
      });
    });
  });

  describe('Update Profile - /api/users/profile', function() {
    it('should return 200 if name is changed', function(done) {
      var changedName = 'User name changed';
      chai.request(server)
      .put('/api/users/profile')
      .set('Authorization', 'JWT ' + user1_token)
      .send({ name: changedName })
      .end(function(err, res) {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.be.a('object');
        expect(res.body.name).to.eq(changedName);
        done();
      });
    });

    it('should return 422 if name is empty', function(done) {
      chai.request(server)
      .put('/api/users/profile')
      .set('Authorization', 'JWT ' + user1_token)
      .send({ name: '' })
      .end(function(err, res) {
        expect(res.status).to.eq(422);
        done();
      });
    });
  });

  describe('Update password - /api/users/password', function() {
    it('should return 422 if new password is empty', function(done) {
      chai.request(server)
      .put('/api/users/password')
      .set('Authorization', 'JWT ' + user1_token)
      .send({ oldPassword: 'passw0rd', newPassword: '' })
      .end(function(err, res) {
        expect(res.status).to.eq(422);
        done();
      });
    });

    it('should return 403 if old password is not matched', function(done) {
      chai.request(server)
      .put('/api/users/password')
      .set('Authorization', 'JWT ' + user1_token)
      .send({ oldPassword: 'password' })
      .end(function(err, res) {
        expect(res.status).to.eq(403);
        done();
      });
    });

    it('should return 200 if password is changed', function(done) {
      chai.request(server)
      .put('/api/users/password')
      .set('Authorization', 'JWT ' + user1_token)
      .send({ oldPassword: 'passw0rd', newPassword: 'password' })
      .end(function(err, res) {
        expect(res.status).to.eq(200);
        done();
      });
    });
  });

  describe('Get the user list - /api/users', function() {
    it('should return 403 if role is user', function(done) {
      chai.request(server)
      .get('/api/users')
      .set('Authorization', 'JWT ' + user1_token)
      .end(function(err, res) {
        expect(res.status).to.eq(403);
        done();
      });
    });

    it('should return 200 if role is manager', function(done) {
      User.count({ role: 'user' }, function(e, count) {
        chai.request(server)
        .get('/api/users')
        .set('Authorization', 'JWT ' + manager1_token)
        .end(function(err, res) {
          expect(res.status).to.eq(200);
          expect(res.body.length).to.be.eq(count);
          done();
        });
      });
    });

    it('should return 200 if role is admin', function(done) {
      User.count({}, function(e, count) {
        chai.request(server)
        .get('/api/users')
        .set('Authorization', 'JWT ' + admin1_token)
        .end(function(err, res) {
          expect(res.status).to.eq(200);
          expect(res.body.length).to.be.eq(count);
          done();
        });
      });
    });
  });

  describe('Create a user - /api/users/new', function() {
    it('should return 403 if the user is creating a user', function(done) {
      params = { name: 'user3', email: 'user3@calorie.com', password: 'passw0rd', caloriesPerDay: 100 };
      chai.request(server)
      .post('/api/users/new')
      .set('Authorization', 'JWT ' + user1_token)
      .send(params)
      .end(function(err, res) {
        expect(res.status).to.eq(403);
        done();
      });
    });

    it('should return 201 if the manager is creating a user', function(done) {
      params = { name: 'user3', email: 'user3@calorie.com', password: 'passw0rd', caloriesPerDay: 100 };
      chai.request(server)
      .post('/api/users/new')
      .set('Authorization', 'JWT ' + manager1_token)
      .send(params)
      .end(function(err, res) {
        expect(res.status).to.eq(201);
        expect(res.body.email).to.eq(params.email);
        done();
      });
    });

    it('should return 401 if the manager is creating a manager', function(done) {
      params = { name: 'manager2', email: 'manager2@calorie.com', password: 'passw0rd', caloriesPerDay: 100, role: 'manager' };
      chai.request(server)
      .post('/api/users/new')
      .set('Authorization', 'JWT ' + manager1_token)
      .send(params)
      .end(function(err, res) {
        expect(res.status).to.eq(403);
        done();
      });
    });

    it('should return 201 if the admin is creating a manager', function(done) {
      params = { name: 'manager2', email: 'manager2@calorie.com', password: 'passw0rd', caloriesPerDay: 100, role: 'manager' };
      chai.request(server)
      .post('/api/users/new')
      .set('Authorization', 'JWT ' + admin1_token)
      .send(params)
      .end(function(err, res) {
        expect(res.status).to.eq(201);
        expect(res.body.email).to.eq(params.email);
        done();
      });
    });

    it('should return 201 if the admin is creating an admin', function(done) {
      params = { name: 'admin2', email: 'admin2@calorie.com', password: 'passw0rd', caloriesPerDay: 100, role: 'admin' };
      chai.request(server)
      .post('/api/users/new')
      .set('Authorization', 'JWT ' + admin1_token)
      .send(params)
      .end(function(err, res) {
        expect(res.status).to.eq(201);
        expect(res.body.email).to.eq(params.email);
        done();
      });
    });
  });

  describe('Get a single user - /api/users/:id', function() {
    it('should return 403 if the user is getting a user', function(done) {
      chai.request(server)
      .get('/api/users/' + user1._id)
      .set('Authorization', 'JWT '+ user1_token)
      .end(function(err, res) {
        expect(res.status).to.eq(403);
        done();
      });
    });

    it('should return 200 if the manager is getting a user', function(done) {
      chai.request(server)
      .get('/api/users/' + user1._id)
      .set('Authorization', 'JWT '+ manager1_token)
      .end(function(err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.email).to.eq(user1.email);
        done();
      });
    });

    it('should return 403 if the manager is getting a manager', function(done) {
      chai.request(server)
      .get('/api/users/' + manager1._id)
      .set('Authorization', 'JWT '+ manager1_token)
      .end(function(err, res) {
        expect(res.status).to.eq(403);
        done();
      });
    });

    it('should return 200 if the admin is getting a manager', function(done) {
      chai.request(server)
      .get('/api/users/' + manager1._id)
      .set('Authorization', 'JWT '+ admin1_token)
      .end(function(err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.email).to.eq(manager1.email);
        done();
      });
    });

    it('should return 200 if the admin is getting an admin', function(done) {
      chai.request(server)
      .get('/api/users/' + admin1._id)
      .set('Authorization', 'JWT '+ admin1_token)
      .end(function(err, res) {
        expect(res.status).to.eq(200);
        expect(res.body.email).to.eq(admin1.email);
        done();
      });
    });
  });

  describe('Update a single user - /api/users/:id', function() {
    it('should be 403 if user is updating a user', function(done) {
      User.find({ role: 'user' }, function(e, users) {
        var id = users[0]._id;
        var changedName = users[0].name + ' changed';
        chai.request(server)
        .put('/api/users/' + id)
        .set('Authorization', 'JWT ' + user1_token)
        .send({ name: changedName })
        .end(function(err, res) {
          expect(res.status).to.eq(403);
          done();
        });
      });
    });

    it('should be 200 if manager is updating a user', function(done) {
      User.find({ role: 'user' }, function(e, users) {
        var id = users[0]._id;
        var changedName = users[0].name + ' changed';
        chai.request(server)
        .put('/api/users/' + id)
        .set('Authorization', 'JWT ' + manager1_token)
        .send({ name: changedName })
        .end(function(err, res) {
          expect(res.status).to.eq(200);
          expect(res.body.name).to.eq(changedName);
          done();
        });
      });
    });

    it('should be 403 if manager is updating a manager', function(done) {
      User.find({ role: 'manager' }, function(e, users) {
        var id = users[0]._id;
        var changedName = users[0].name + ' changed';
        chai.request(server)
        .put('/api/users/' + id)
        .set('Authorization', 'JWT ' + manager1_token)
        .send({ name: changedName })
        .end(function(err, res) {
          expect(res.status).to.eq(403);
          done();
        });
      });
    });

    it('should be 200 if admin is updating a manager', function(done) {
      User.find({ role: 'manager' }, function(e, users) {
        var id = users[0]._id;
        var changedName = users[0].name + ' changed';
        chai.request(server)
        .put('/api/users/' + id)
        .set('Authorization', 'JWT ' + admin1_token)
        .send({ name: changedName })
        .end(function(err, res) {
          expect(res.status).to.eq(200);
          expect(res.body.name).to.eq(changedName);
          done();
        });
      });
    });

    it('should be 200 if admin is updating an admin', function(done) {
      User.find({ role: 'admin' }, function(e, users) {
        var id = users[0]._id;
        var changedName = users[0].name + ' changed';
        chai.request(server)
        .put('/api/users/' + id)
        .set('Authorization', 'JWT ' + admin1_token)
        .send({ name: changedName })
        .end(function(err, res) {
          expect(res.status).to.eq(200);
          expect(res.body.name).to.eq(changedName);
          done();
        });
      });
    });
  });

  describe('Update password of a single user - /api/users/password/:id', function() {
    it('should be 403 if user is updating the password of user', function(done) {
      User.find({ role: 'user' }, function(e, users) {
        var id = users[0]._id;
        chai.request(server)
        .put('/api/users/password/' + id)
        .set('Authorization', 'JWT ' + user1_token)
        .send({ oldPassword: '', newPassword: '' })
        .end(function(err, res) {
          expect(res.status).to.eq(403);
          done();
        });
      });
    });

    it('should be 422 if manager is updating the password of user with mismatched password', function(done) {
      User.find({ role: 'user' }, function(e, users) {
        var id = users[0]._id;
        chai.request(server)
        .put('/api/users/password/' + id)
        .set('Authorization', 'JWT ' + manager1_token)
        .send({ oldPassword: '', newPassword: '' })
        .end(function(err, res) {
          expect(res.status).to.eq(422);
          done();
        });
      });
    });

    it('should be 422 if manager is updating the password of user with short password', function(done) {
      User.find({ role: 'user' }, function(e, users) {
        var id = users[0]._id;
        chai.request(server)
        .put('/api/users/password/' + id)
        .set('Authorization', 'JWT ' + manager1_token)
        .send({ oldPassword: 'password', newPassword: 'pass' })
        .end(function(err, res) {
          expect(res.status).to.eq(422);
          done();
        });
      });
    });

    it('should be 200 if manager is updating the password of user', function(done) {
      User.find({ role: 'user' }, function(e, users) {
        var id = users[0]._id;
        chai.request(server)
        .put('/api/users/password/' + id)
        .set('Authorization', 'JWT ' + manager1_token)
        .send({ oldPassword: 'password', newPassword: 'passw0rd' })
        .end(function(err, res) {
          expect(res.status).to.eq(200);
          done();
        });
      });
    });

    it('should be 403 if manager is updating the password of manager', function(done) {
      User.find({ role: 'manager' }, function(e, users) {
        var id = users[0]._id;
        chai.request(server)
        .put('/api/users/password/' + id)
        .set('Authorization', 'JWT ' + manager1_token)
        .send({ oldPassword: '', newPassword: '' })
        .end(function(err, res) {
          expect(res.status).to.eq(403);
          done();
        });
      });
    });

    it('should be 200 if admin is updating the password of manager', function(done) {
      User.find({ role: 'manager' }, function(e, users) {
        var id = users[0]._id;
        chai.request(server)
        .put('/api/users/password/' + id)
        .set('Authorization', 'JWT ' + admin1_token)
        .send({ oldPassword: 'passw0rd', newPassword: 'passw0rd' })
        .end(function(err, res) {
          expect(res.status).to.eq(200);
          done();
        });
      });
    });

    it('should be 200 if admin is updating the password of admin', function(done) {
      User.find({ role: 'manager' }, function(e, users) {
        var id = users[0]._id;
        chai.request(server)
        .put('/api/users/password/' + id)
        .set('Authorization', 'JWT ' + admin1_token)
        .send({ oldPassword: 'passw0rd', newPassword: 'passw0rd' })
        .end(function(err, res) {
          expect(res.status).to.eq(200);
          done();
        });
      });
    });
  });

  describe('Delete a user - /api/users/:id', function() {
    it('should be 403 if user is deleting a user', function(done) {
      User.find({ role: 'user' }, function(e, users) {
        var id = users[0]._id;
        chai.request(server)
        .delete('/api/users/' + id)
        .set('Authorization', 'JWT ' + user1_token)
        .end(function(err, res) {
          expect(res.status).to.eq(403);
          done();
        });
      });
    });

    it('should be 204 if manager is deleting a user', function(done) {
      User.find({ role: 'user' }, function(e, users) {
        var id = users[0]._id;
        chai.request(server)
        .delete('/api/users/' + id)
        .set('Authorization', 'JWT ' + manager1_token)
        .end(function(err, res) {
          expect(res.status).to.eq(204);
          Meal.count({ user: id }, function(e, count) {
            expect(count).to.eq(0);
            done();
          });
        });
      });
    });

    it('should be 403 if manager is deleting a manager', function(done) {
      User.find({ role: 'manager' }, function(e, users) {
        var id = users[0]._id;
        chai.request(server)
        .delete('/api/users/' + id)
        .set('Authorization', 'JWT ' + manager1_token)
        .end(function(err, res) {
          expect(res.status).to.eq(403);
          done();
        });
      });
    });

    it('should be 204 if admin is deleting a manager', function(done) {
      User.find({ role: 'manager' }, function(e, users) {
        var id = users[0]._id;
        chai.request(server)
        .delete('/api/users/' + id)
        .set('Authorization', 'JWT ' + admin1_token)
        .end(function(err, res) {
          expect(res.status).to.eq(204);
          Meal.count({ user: id }, function(e, count) {
            expect(count).to.eq(0);
            done();
          });
        });
      });
    });

    it('should be 403 if admin is deleting itself', function(done) {
      chai.request(server)
      .delete('/api/users/' + admin1._id)
      .set('Authorization', 'JWT ' + admin1_token)
      .end(function(err, res) {
        expect(res.status).to.eq(403);
        done();
      });
    });
  });
});
