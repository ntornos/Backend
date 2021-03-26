const router = require('express').Router();
const bcrypt = require('bcryptjs');

const User = require('../../db/models/User');
const { isAdmin } = require('../auth/utils');

module.exports = router;

//  @desc        Get all users
//  @route       GET /admin-actions/find-all
//  @access      Private
router.get('/find-users-all', isAdmin, async (req, res) => {
  try {
    await User.find((err, users) => {
      if (err) throw err;
      return res.send({ status: true, data: users });
    });
  } catch (err) {
    console.error(err);
  }
});

//  @desc        Create user
//  @route       POST /admin/users
//  @access      Private
router.post('/', (req, res, next) => {
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
        return res.send({ status: true, message: 'User created', data: newUser });
      }

      if (user) return res.send({ status: false, message: 'User already exists' });
    });
  } catch (err) {
    console.error(err);
  }
});

//  @desc        Delete user
//  @route       DELETE /admin-actions/delete-user/id
//  @access      Private
router.delete('/delete-user/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  await User.deleteOne({ _id: id }, (err, user) => {
    if (err) throw err;
    else return res.send({ status: true, message: 'user deleted', data: user });
  });
});

//  @desc        Edit user
//  @route       PUT /admin/users
//  @access      Public
router.put('/', isAdmin, async (req, res) => {
  await User.updateOne({ _id: req.body._id }, { ...req.body }, (err, response) => {
    if (err) throw err;
    return res.send(response);
  });
});
