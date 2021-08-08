const mongoose = require('mongoose');

const UserLocationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    display_name: {
        type: String,
        default: ''
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = UserLocation = mongoose.model('userLocation', UserLocationSchema);