const express = require('express');
const {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriverById,
  deleteDriverById,
  assignVehicleToDriver,
} = require('../controllers/driver.controller');

const router = express.Router();

router.route('/create').post(createDriver);
router.route('/').get(getAllDrivers);
router.route('/:id').get(getDriverById);
router.route('/:id').patch(updateDriverById);
router.route('/:id').delete(deleteDriverById);
router.route('/:driverId/assign/:vehicleId').put(assignVehicleToDriver);


module.exports = router;
