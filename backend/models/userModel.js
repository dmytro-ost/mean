const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = mongoose.model('User', new Schema({

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['DRIVER', 'SHIPPER'],
    required: true
  },

  created_date: {
    type: Date,
    default: Date.now()
  }

}, {
  versionKey: false // hide __v field
}));
