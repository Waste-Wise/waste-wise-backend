const express = require('express');
const {
	getAllDrivers,
	getDriverById,
	updateDriverById,
	deleteDriverById,
	assignVehicleToDriver,
	unassignVehicle,
	testController,
	setTransactionStatus,
} = require('../../controllers/driver.controller');
const { isAuthenticated, isVerifiedDriver } = require('../../middleware/auth');
const {
	getAllRoutes,
	getRoutes,
} = require('../../controllers/branch.controller');

const router = express.Router();

router.route('/').get(getAllDrivers);
router.route('/test').get(isAuthenticated, isVerifiedDriver, testController);
router.route('/routes').get(getRoutes);

router
	.route('/:id')
	.get(getDriverById)
	.patch(updateDriverById)
	.delete(deleteDriverById);
router.route('/:driverId/assign-vehicle/:vehicleId').put(assignVehicleToDriver);
router.route('/:id/unassign-vehicle').delete(unassignVehicle);

router.route('/:driverId/transactions').put(setTransactionStatus);

module.exports = router;
