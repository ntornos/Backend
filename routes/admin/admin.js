const User = require('../../db/models/User');
const router = require('express').Router();

const { isAdmin } = require('../auth/utils');

module.exports = router;

//  @desc        Get all users
//  @route       GET /admin/
//  @access      Private
router.get('/', isAdmin, async (req, res) => {
  await User.find((err, users) => {
    if (err) throw err;
    return res.send({ status: true, data: users });
  });
});

//  @desc        Delete user
//  @route       DELETE /admin/
//  @access      Private
router.delete('/', isAdmin, async (req, res) => {
  await User.deleteOne({ _id: req.body._id }, (err, user) => {
    if (err) throw err;
    else return res.send({ status: true, message: 'user deleted', data: user });
  });
});

//  @desc        Edit user
//  @route       PUT /admin/
//  @access      Public
router.put('/', isAdmin, async (req, res) => {
  await User.updateOne({ _id: req.body._id }, { ...req.body }, (err, response) => {
    if (err) throw err;
    return res.send(response);
  });
});
