const mongoose = require('mongoose');

const constantSchema = new mongoose.Schema(
	{
		maxRouteCount: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Constant', constantSchema);
