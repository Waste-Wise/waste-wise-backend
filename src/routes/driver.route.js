const express = require('express');
const {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriverById,
  deleteDriverById,
  assignVehicleToDriver,
  unassignVehicle,
} = require('../controllers/driver.controller');

const router = express.Router();

router.route('/create').post(createDriver);
router.route('/').get(getAllDrivers);
router.route('/:id').get(getDriverById);
router.route('/:id').patch(updateDriverById);
router.route('/:id').delete(deleteDriverById);
router.route('/:driverId/assign-vehicle/:vehicleId').put(assignVehicleToDriver);
router.route('/:id/unassign-vehicle').delete(unassignVehicle);

module.exports = router;
