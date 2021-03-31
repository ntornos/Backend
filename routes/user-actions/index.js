const router = require('express').Router();

module.exports = router;

router.use('/', require('./user.routes'));
router.use('/', require('./listing.routes'));

router.use((req, res, next) => {
  const err = new Error('API route not found!');
  err.status = 404;
  next(err);
});
