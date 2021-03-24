const router = require('express').Router();

module.exports = router;

router.use('/user', require('./user/user.routes'));
router.use('/listing', require('./listings/listings.routes'));
