const router = require('express').Router();

const Listing = require('../../db/models/Listing');
const User = require('../../db/models/User');
const { isLoggedIn } = require('../auth/utils');

module.exports = router;

//  @desc        Delete user account, also deletes user listings
//  @route       DELETE /user-actions/delete-account
//  @access      Private
router.delete('/delete-account', isLoggedIn, (req, res, next) => {
  try {
    User.findByIdAndDelete(req.user.id, async (err, account) => {
      if (err) return next(err);

      await Listing.deleteMany({ userId: req.user.id });

      return res.send({ status: true, message: 'user account deleted', data: account });
    });
  } catch (err) {
    next(err);
  }
});
