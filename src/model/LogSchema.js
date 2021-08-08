const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String,
    default: "Button X was pressed"
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = Logs = mongoose.model('logs', LogSchema);