const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('../../db/models/User');
const bcrypt = require('bcryptjs');

const LocalStrategy = passportLocal.Strategy;

module.exports = () => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) throw err;

        if (!user) return done(null, false);

        bcrypt.compare(password, user.password, (err, loggedIn) => {
          if (err) throw err;

          return loggedIn ? done(null, user) : done(null, false);
        });
      });
    })
  );
};
