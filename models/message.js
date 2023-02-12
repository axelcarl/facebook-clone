const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: String,
  comments: [String],
  user: {
    type: String
  },
  date: Date
});

module.exports = mongoose.model('Message', messageSchema);