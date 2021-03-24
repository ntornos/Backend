const router = require('express').Router();

module.exports = router;

router.use('/users', require('./user/user.routes'));
router.use('/listings', require('./listings/listings.routes'));
