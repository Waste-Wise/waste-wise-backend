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
			lon: {
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
				type: String,
			},
		],
	},
	{ timestamps: true }
);

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
		route_stops: [routeStopSchema],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Route', routeSchema);
