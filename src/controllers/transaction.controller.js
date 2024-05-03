const { StatusCodes } = require('http-status-codes');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Transaction = require('../models/transaction');
const ErrorHandler = require('../utils/ErrorHandler');

// GET /
exports.getAllTransactions = catchAsyncErrors(async (req, res, next) => {
	Transaction.find().then((data) => {
		res.status(StatusCodes.OK).json({
			success: true,
			data,
		});
	});
});

// GET /:transactionId
exports.getTransactionById = catchAsyncErrors(async (req, res, next) => {
	const { transactionId } = req.params;

	const transaction = await Transaction.findById(transactionId);

	if (!transaction) {
		return next(
			new ErrorHandler('Transaction not found', StatusCodes.NOT_FOUND)
		);
	}

	return res.status(StatusCodes.OK).json({
		success: true,
		data: transaction,
	});
});

// hard delete => DELETE /:transactionId
exports.deleteTransactionById = catchAsyncErrors(async (req, res, next) => {
	const { transactionId } = req.params;

	const transaction = await Transaction.findById(transactionId);

	if (!transaction) {
		return next(
			new ErrorHandler('Transaction not found', StatusCodes.NOT_FOUND)
		);
	}

	await transaction.deleteOne();

	return res.status(StatusCodes.OK).json({
		success: true,
		message: 'Transaction deleted successfully',
	});
});
