const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const topupsControllers = require('./topups-controller');
const topupsValidator = require('./topups-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/topups', route);

  route.get('/', authenticationMiddleware, topupsControllers.getTopups);

  route.post(
    '/',
    authenticationMiddleware,
    celebrate(topupsValidator.createTopup),
    topupsControllers.createTopup
  );

  route.get('/:id', authenticationMiddleware, topupsControllers.getTopup);

  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(topupsValidator.updateTopup),
    topupsControllers.updateTopupNotes
  );

  route.delete('/:id', authenticationMiddleware, topupsControllers.deleteTopup);
};
