const mongoose = require('mongoose');

const routeStopSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    matched_substrings: [
      {
        length: {
          type: Number,
        },
        offset: {
          type: Number,
        },
      },
    ],
    position: {
      lat: {
        type: String,
      },
      long: {
        type: String,
      },
    },
    place_id: {
      type: String,
    },
    reference: {
      type: String,
    },
    structured_formatting: {
      main_text: {
        type: String,
      },
      main_text_matched_substrings: [
        {
          length: {
            type: Number,
          },
          offset: {
            type: Number,
          },
        },
      ],
      secondary_text: {
        type: String,
      },
      terms: [
        {
          offset: {
            type: Number,
          },
          value: {
            type: String,
          },
        },
      ],
      types: [
        {
            type: String
        }
      ]
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RouteStop', routeStopSchema);
