const mongoose = require('mongoose');

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true,
    minlength:2
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength:6
  },
  age: {
    type: Number,
    min: 18,
    max: 150,
    trim: true
  }
});

module.exports = {User};
