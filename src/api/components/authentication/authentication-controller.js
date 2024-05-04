const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
const attempts = {};
/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(req, res, next) {
  const { email, password } = req.body;
  const now = new Date();
  const { lastAttempted = null, count = 0 } = attempts[email] || {};

  if (count >= 6 && lastAttempted) {
    const difference = now - lastAttempted;
    const counter = 30 * 60 * 1000;
    if (difference < counter) {
      return next(
        errorResponder(errorTypes.FORBIDDEN, `Too many failed login attempts`)
      );
    } else {
      delete attempts[email];
    }
  }

  try {
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      const newCount = (attempts[email]?.count || 0) + 1;
      attempts[email] = { lastAttempted: now, count: newCount };
      if (newCount >= 6) {
        return next(
          errorResponder(errorTypes.FORBIDDEN, 'Too many failed login attempts')
        );
      }
      return next(
        errorResponder(
          errorTypes.INVALID_CREDENTIALS,
          'Wrong email or password'
        )
      );
    }

    delete attempts[email];
    return res.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};

module.exports = {
  login,
};
