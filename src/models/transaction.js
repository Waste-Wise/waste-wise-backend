const mongoose = require('mongoose');
const transactionStatus = require('../../config/constants');

const transactionSchema = new mongoose.Schema(
	{
		realStartTime: {
			type: Number,
		},
		realEndTime: {
			type: String,
		},
		taskId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		driverId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		branchId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		status: {
			type: String,
			requied: true,
			default: transactionStatus.PENDING,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
