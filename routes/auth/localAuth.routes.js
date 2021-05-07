const router = require('express').Router();
const passport = require('passport');
const User = require('../../db/models/User');
const bcrypt = require('bcryptjs');
const ErrorResponse = require('../../utils/errorResponse');

module.exports = router;

//  @desc        Get logged in user
//  @route       GET /account/me
//  @access      Public
router.get('/me', (req, res, next) => {
  try {
    return res.send({ data: req.user });
    // else return next(new ErrorResponse('No', 404));
    // return;
  } catch (err) {
    next(new ErrorResponse('Error catched at /me user route', 404));
  }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ status: true });
});

//  @desc        Register user
//  @route       POST /account/reguster
//  @access      Public
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return next(new ErrorResponse('Improper values at register', 404));
    }

    User.findOne({ email: email }, async (err, user) => {
      if (err) return next(new ErrorResponse('Error while fetching user in database.', 500), false);

      if (!user) {
        const newUser = new User({
          email,
          password: await bcrypt.hash(password, 10),
          role,
        });
        await newUser.save();
        return res.send({ status: true });
      }

      if (user)
        return next(new ErrorResponse('An user with this email already exists.', 500), false);
    });
  } catch (err) {
    next(new ErrorResponse('Error catched on /register', 500));
  }
});

//  @desc        Logout user
//  @route       POST /account/logout
//  @access      Public
router.get('/logout', (req, res) => {
  try {
    if (req.user) {
      req.logout();
      req.session.destroy();
      return res.send({ status: true, message: 'User logged out' });
    } else return new ErrorResponse('No user to sign out', 404);
  } catch (err) {
    next(new ErrorResponse('Error catrched on /logout', 500));
  }
});
