const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
  address: { type: String, required: true },
  coordinates: { type: [Number], required: true },
});

module.exports = mongoose.model('Locations', LocationSchema);
