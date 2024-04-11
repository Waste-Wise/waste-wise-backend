const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema(
  {
    route_name: {
      type: String,
    },
    route_start: {
      type: String,
    },
    route_end: {
      type: String,
    },
    route_distance: {
      type: String,
    },
    route_duration: {
      type: String,
    },
    route_stops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RouteStop',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Route', routeSchema);
