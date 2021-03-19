const origins = ['http://localhost:3000'];

const corsHandler = (req, callback) => {
  let corsOptions;

  const isDomainAllowed = origins.includes(req.header('Origin'));

  isDomainAllowed && (corsOptions = { origin: true, credentials: true });
  // : (corsOptions = { origin: false, credentials: true });

  callback(null, corsOptions);
};

module.exports = corsHandler;
