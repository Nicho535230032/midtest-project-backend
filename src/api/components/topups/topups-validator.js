const joi = require('joi');

module.exports = {
  createTopup: {
    body: {
      total: joi.number().required().label('Total Amount'),
      from: joi.string().required().label('From Bank'),
      to: joi.string().required().label('To Account'),
      notes: joi.string().required().label('Notes'),
    },
  },

  updateTopup: {
    body: {
      notes: joi.string().required().label('Notes'),
    },
  },
};
