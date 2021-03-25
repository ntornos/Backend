const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'ADMIN') {
    return next();
  }
  return res.send({ status: false, message: 'User is not an admin' });
};

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.send({ status: false, message: 'User not logged in' });
};

module.exports = { isAdmin, isLoggedIn };
