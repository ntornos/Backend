const router = require('express').Router();

module.exports = router;

router.use('/', require('./localAuth.routes'));
