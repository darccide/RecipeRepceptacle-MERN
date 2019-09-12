const mongoose = require('mongoose');

const CreatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true 
  },
  email: {
    type: String,
    required: true,
    unique: true 
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Creator = mongoose.model('creator', CreatorSchema);