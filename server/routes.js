/**
 * API Server Routes
 */

'use strict';

module.exports = function(app) {
  app.use('/api/authenticate', require('./modules/auth'));
  app.use('/api/users', require('./modules/users'));
  app.use('/api/meals', require('./modules/meals'));

  app.use(function(err, req, res, next) {
    if(!err) return next();

    console.log(err.stack);

    res.status(500).json({
      error: err.stack
    });
  });

  app.use(function(req, res) {
    res.status(404).json({
      url: req.originalUrl,
      error: 'Not Found'
    });
  });
};
