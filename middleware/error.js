const errorHandler = (err, req, res, next) => {
  // Log to console for dev
  console.log(err.stack, 'stack?');
  console.log(err.message);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
};

module.exports = errorHandler;
