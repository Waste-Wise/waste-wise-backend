const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema(
  {
    latitude: {
        type: String
    },
    longitude: {
        type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Position', positionSchema);
