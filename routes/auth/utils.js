const passport = require('passport');

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'ADMIN') {
    return next();
  }
  return res.send({ status: false, message: 'User is not an admin' });
};

module.exports = { isAdmin };
