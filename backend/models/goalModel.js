'use strict'

const mongoose = require('mongoose');
const goalSchema = mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Añade un texto válido']
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Goal', goalSchema);