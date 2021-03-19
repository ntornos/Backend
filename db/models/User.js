const mongoose = require('mongoose');

const user = new mongoose.Schema({
  username: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  google: {
    type: String,
    required: false,
    id: String,
    token: String,
    name: String,
  },
});

const User = mongoose.model('User', user);

module.exports = User;
