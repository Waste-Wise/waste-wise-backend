const { StatusCodes } = require('http-status-codes');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const Driver = require('../models/driver');
const Vehicle = require('../models/vehicle');
const transactionStatus = require('../../config/constants');
const Transaction = require('../models/transaction');

// GET /
exports.getAllDrivers = catchAsyncErrors(async (req, res) =>
	Driver.find().then((data) => {
		res.status(StatusCodes.OK).json({
			success: true,
			data,
		});
	})
);

// GET /:id
exports.getDriverById = catchAsyncErrors(async (req, res, next) => {
	const { id } = req.params;

	const driver = await Driver.findById(id).populate('assignedVehicle');

	if (!driver) {
		return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
	}

	return res.status(StatusCodes.OK).json({
		success: true,
		data: driver,
	});
});

// PATCH /:id
exports.updateDriverById = catchAsyncErrors(async (req, res, next) => {
	const { id } = req.params;

	const driver = await Driver.findById(id);

	if (!driver) {
		return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
	}

	Object.assign(driver, req.body);

	await driver.save();

	return res.status(StatusCodes.OK).json({
		success: true,
		data: driver,
	});
});

// hard delete => DELETE /:id
exports.deleteDriverById = catchAsyncErrors(async (req, res, next) => {
	const { id } = req.params;

	const driver = await Driver.findById(id);

	if (!driver) {
		return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
	}

	await driver.deleteOne();

	return res.status(StatusCodes.OK).json({
		success: true,
		message: 'Driver deleted successfully',
	});
});

// PUT /:driverId/assign/:vehicleId
exports.assignVehicleToDriver = catchAsyncErrors(async (req, res, next) => {
	const { driverId, vehicleId } = req.params;

	const driver = await Driver.findById(driverId);

	if (!driver) {
		return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
	}

	const vehicle = await Vehicle.findById(vehicleId);

	if (!vehicle) {
		return next(new ErrorHandler('Vehicle not found', StatusCodes.NOT_FOUND));
	}

	if (vehicle.isDriverAssigned) {
		return next(
			new ErrorHandler('Vehicle already assigned', StatusCodes.CONFLICT)
		);
	}

	const previouslyAssignedVehicle = driver.assignedVehicle;

	/* eslint-disable no-underscore-dangle */
	if (previouslyAssignedVehicle) {
		await Vehicle.findByIdAndUpdate(previouslyAssignedVehicle._id, {
			isDriverAssigned: false,
		});
	}
	/* eslint-disable no-underscore-dangle */

	driver.assignedVehicle = vehicle._id;
	vehicle.isDriverAssigned = true;

	await driver.save();
	await vehicle.save();

	return res.status(StatusCodes.OK).json({
		status: true,
		message: 'Driver assigned the vehicle successfully',
	});
});

// DELETE /:id/unassign
exports.unassignVehicle = catchAsyncErrors(async (req, res, next) => {
	const { id } = req.params;

	const driver = await Driver.findById(id);

	if (!driver) {
		return next(new ErrorHandler('Driver not found', StatusCodes.NOT_FOUND));
	}

	if (!driver.assignedVehicle) {
		return next(
			new ErrorHandler(
				'Vehicle is not assigned to the driver',
				StatusCodes.CONFLICT
			)
		);
	}

	await Vehicle.findByIdAndUpdate(driver.assignedVehicle._id, {
		isDriverAssigned: false,
	});

	driver.assignedVehicle = undefined;

	await driver.save();

	return res.status(StatusCodes.OK).json({
		success: true,
		message: 'Vehicle unassigned successfully',
	});
});

// GET /test
exports.testController = catchAsyncErrors(async (req, res, next) => {
	res.status(StatusCodes.OK).json({
		success: true,
		message: 'Driver is verified',
	});
});

// PUT /:driverId/transactions/?taskId=TA123
exports.setTransactionStatus = catchAsyncErrors(async (req, res, next) => {
	const { taskId } = req.query;
	const { status } = req.body;

	const today = undefined;
	/**
	 * Filter by date as well!: transaction.createdAt attrib
	 *
	 */

	const transaction = await Transaction.findOne({ taskId, today });

	if (!transaction) {
		return next(new ErrorHandler('Invalid task id', StatusCodes.BAD_REQUEST));
	}

	if (transaction.status === transactionStatus.DISABLED) {
		return next(
			new ErrorHandler('Transaction is disabled', StatusCodes.FORBIDDEN)
		);
	}

	if (status === transaction.status) {
		return next(
			new ErrorHandler('Already in the given state', StatusCodes.BAD_REQUEST)
		);
	}

	switch (status) {
		case transactionStatus.ONGOING:
			transaction.realStartTime = Date.now();
			transaction.realEndTime = undefined;
			break;
		case transactionStatus.ABORTED:
			transaction.realStartTime = undefined;
			transaction.realEndTime = undefined;
			break;
		case transactionStatus.COMPLETE:
			transaction.realEndTime = Date.now();
			break;
		default:
			return next(
				new ErrorHandler('Invalid transaction status', StatusCodes.BAD_REQUEST)
			);
	}

	transaction.status = status;

	await transaction.save();

	return res.status(StatusCodes.ACCEPTED).json({
		success: true,
		message: `Transaction status changed to ${status}`,
		data: transaction,
	});
});
