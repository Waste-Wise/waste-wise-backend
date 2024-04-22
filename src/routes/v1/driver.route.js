const express = require('express');
const {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriverById,
  deleteDriverById,
  assignVehicleToDriver,
  unassignVehicle,
  testController,
} = require('../../controllers/driver.controller');
const { isAuthenticated, isVerifiedDriver } = require('../../middleware/auth');

const router = express.Router();

router.route('/create').post(createDriver);
router.route('/').get(getAllDrivers);
router.route('/test').get(isAuthenticated, isVerifiedDriver, testController);

router
  .route('/:id')
  .get(getDriverById)
  .patch(updateDriverById)
  .delete(deleteDriverById);
router.route('/:driverId/assign-vehicle/:vehicleId').put(assignVehicleToDriver);
router.route('/:id/unassign-vehicle').delete(unassignVehicle);

module.exports = router;
