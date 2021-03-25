const router = require('express').Router();

module.exports = router;

router.use('/', require('./user.routes'));
router.use('/', require('./listing.routes'));
