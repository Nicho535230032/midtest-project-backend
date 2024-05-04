const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const topups = require('./components/topups/topups-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  topups(app);

  return app;
};
