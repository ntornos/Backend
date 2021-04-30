const router = require('express').Router();
const passport = require('passport');
const User = require('../../db/models/User');
const bcrypt = require('bcryptjs');

module.exports = router;

//  @desc        Get logged in user
//  @route       GET /account/me
//  @access      Public
router.get('/me', (req, res, next) => {
  try {
    if (req.user) return res.send({ status: true, data: req.user });
    else res.send({ status: false, message: 'No user logged in' });
  } catch (err) {
    next(err);
  }
});

//  @desc        Login user
//  @route       POST /account/login
//  @access      Public
router.post('/login', passport.authenticate('local'), (req, res) => {
  try {
    res.json({ status: true });
  } catch (err) {
    // console.log(err, 'err');
    next(err);
  }
});

//  @desc        Register user
//  @route       POST /account/reguster
//  @access      Public
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      res.send({ status: false, message: 'Improper values' });
      return;
    }

    User.findOne({ email: email }, async (err, user) => {
      if (err) throw err;

      if (!user) {
        const newUser = new User({
          email,
          password: await bcrypt.hash(password, 10),
          role,
        });
        await newUser.save();
        return res.send({ status: true });
      }

      if (user) return res.send({ status: false });
    });
  } catch (err) {
    next(err);
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
    } else return res.send({ status: false, messsage: 'No user logged in' });
  } catch (err) {
    next(err);
  }
});
