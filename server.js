const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const express = require('express');
const passport = require('passport');

const app = express();
const PORT = 4000;

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
require('./routes/auth/localStrategy')();

// Serialize
passport.serializeUser((user, done) => done(null, user._id));

// Deserialize
passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(null, user)));

// Routes
app.use('/account', require('./routes/auth/local'));

// Start Server
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server started in port: ${PORT}`);
});
