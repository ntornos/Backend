const passport = require('passport');
const router = require('express').Router();
const User = require('../../db/models/User');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = router;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    // this function gets called on a succesful authentication!
    // the function below is called the verify cb.
    function (_, __, profile, cb) {
      // insert into db.
      const email = profile.emails[0].value;
      User.findOne({ email: email }, async (err, doc) => {
        // return the error but no user is coming back
        if (err) return cb(err, null);

        if (!doc) {
          // create new user
          const newUser = new User({
            googleId: profile.id,
            username: profile.name.givenName,
            email,
          });
          await newUser.save();
          // if it doesn't exist send the new user
          cb(null, newUser);
        }

        if (doc && !doc.googleId) {
          User.updateOne(
            { email: email },
            {
              $set: {
                googleId: profile.id,
              },
            }
          );
        }

        // if it does exist send the found doc
        cb(null, doc);
      });
    }
  )
);

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get(
  process.env.GOOGLE_CALLBACK_URL,
  passport.authenticate('google', {
    successRedirect: `${process.env.REACT_APP_CLIENT_URL}/account`,
    failureRedirect: `${process.env.REACT_APP_CLIENT_URL}/login`,
  })
);
