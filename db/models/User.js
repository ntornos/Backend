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
  googleId: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: false,
    default: 'CUSTOMER',
  },
  profilePicture: {
    type: String,
    required: false,
    default:
      'https://freepikpsd.com/wp-content/uploads/2019/10/default-user-profile-image-png-2-Transparent-Images-1.png',
  },
});

const User = mongoose.model('User', user);

module.exports = User;
