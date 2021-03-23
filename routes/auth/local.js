const router = require('express').Router();
const passport = require('passport');
const User = require('../../db/models/User');
const bcrypt = require('bcryptjs');

module.exports = router;

router.get('/me', (req, res, next) => {
  if (req.user) return res.send({ status: true, data: req.user });
  else res.send({ status: false, message: 'No user logged in' });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ status: true });
});

router.post('/register', async (req, res, next) => {
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
      return res.send({ status: true, message: 'User created', data: newUser });
    }

    if (user) return res.send({ status: false, message: 'User already exists' });
  });
});

router.get('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    req.session.destroy();
    return res.send({ status: true, message: 'User logged out' });
  } else return res.send({ status: false, messsage: 'No user logged in' });
});
