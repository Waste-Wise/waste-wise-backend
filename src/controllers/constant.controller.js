const { StatusCodes } = require('http-status-codes');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Constant = require('../models/constant');

exports.getConstants = catchAsyncErrors(async (req, res, next) => {
	const constants = await Constant.find();

	res.status(StatusCodes.OK).json({
		success: true,
		data: contants,
	});
});

exports.createConstant = catchAsyncErrors(async (req, res, next) => {
	const constants = await Constant.findOne('maxRouteCount');

	constants.maxRouteCount = 1;

	await constants.save();

	res.status(StatusCodes.ACCEPTED).json({
		success: true,
		constants,
	});
});
