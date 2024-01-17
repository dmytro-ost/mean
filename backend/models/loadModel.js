const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types } = mongoose;

module.exports = mongoose.model('Load', new Schema({

  created_by: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },

  assigned_to: {
    type: Types.ObjectId, ref: 'User'
  },

  status: {
    type: String,
    required: true,
    enum: ['NEW', 'POSTED', 'ASSIGNED', 'SHIPPED']
  },

  state: {
    type: String,
    enum: [
      'En route to Pick Up',
      'Arrived to Pick Up',
      'En route to delivery',
      'Arrived to delivery'
    ]
  },

  name: {
    type: String,
    required: true
  },

  payload: {
    type: Number,
    required: true
  },

  pickup_address: {
    type: String,
    required: true
  },

  delivery_address: {
    type: String,
    required: true
  },

  dimensions: {
    width: {
      type: Number,
      required: true
    },
    length: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },

  logs: [
    {
      message: {
        type: String,
        required: true
      },
      time: {
        type: Date,
        default: Date.now()
      }
    }
  ],

  created_date: {
    type: Date,
    default: Date.now()
  }

}, {
  versionKey: false // hide __v field
}));
