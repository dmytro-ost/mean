const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types } = mongoose;

module.exports = mongoose.model('Truck', new Schema({

  created_by: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },

  assigned_to: {
    type: Types.ObjectId,
    ref: 'User',
    default: null
  },

  type: {
    type: String,
    required: true,
    enum: ['SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT']
  },

  status: {
    type: String,
    required: true,
    enum: ['OL', 'IS'] // ON LOAD, IN SERVICE
  },

  created_date: {
    type: Date,
    default: Date.now()
  }

}, {
  versionKey: false // hide __v field
}));
