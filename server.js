const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');

const app = express();
const PORT = 4000;

// logging middleware for requests
app.use(morgan('dev'));

// Load Environmental Variables
require('dotenv').config({ path: (__dirname, 'config/.env.development') });

// Start DB
require('./db/index')();

// Body Parser
app.use(express.json());

// CORS Middleware
const corsHandler = require('./utils/corsHandler');
const User = require('./db/models/User');
app.use(cors(corsHandler));

// Creates Session
app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: 'strict',
      secure: 'auto',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// Cookie Parser
app.use(cookieParser());

// Start Passport
app.use(passport.initialize());
app.use(passport.session());

// Strategies
app.use(require('./routes/auth/googleStrategy'));
require('./routes/auth/localStrategy')();

// Serialize
passport.serializeUser((user, done) => done(null, user._id));

// Deserialize
passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(null, user)));

// Routes
app.use('/account', require('./routes/auth/'));
app.use('/admin-actions', require('./routes/admin-actions/'));
app.use('/api/listings', require('./routes/api/listings'));
app.use('/user-actions', require('./routes/user-actions/'));

app.use(errorHandler);

// app.use((err, req, res, next) => {
//   console.log('500 in server.js');
//   console.error(err);
//   res.status(401).json({ message: err.message });
//   // res.status(500).json({success: false, error 'Sorry, error'});

//   // return res.status(err.status || 500).send(err.message || 'Internal server error');
// });

// Start Server
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server started in port: ${PORT}`);
});
