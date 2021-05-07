const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('../../db/models/User');
const bcrypt = require('bcryptjs');
const ErrorResponse = require('../../utils/errorResponse');

const LocalStrategy = passportLocal.Strategy;

module.exports = () => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err)
          return done(new ErrorResponse('Error while fetching user in database.', 500), false);

        // error throws if the email is not associated with any account.
        if (!user)
          // sending a 401 Unauthorized
          return done(new ErrorResponse('No account associated with this email.', 404), false);

        bcrypt.compare(password, user.password, (err, loggedIn) => {
          if (err)
            return done(new ErrorResponse('bcrypt error couldnt compare passwords.', 500), false);
          return loggedIn
            ? done(null, user)
            : done(new ErrorResponse('Invalid password.', 401), false);
        });
      });
    })
  );
};
