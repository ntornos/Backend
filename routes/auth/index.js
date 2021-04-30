const router = require('express').Router();

module.exports = router;

router.use('/', require('./localAuth.routes'));

router.use((req, res, next) => {
  console.log('hello');
  const err = new Error('API route not found!');
  err.status = 404;
  next(err);
});
