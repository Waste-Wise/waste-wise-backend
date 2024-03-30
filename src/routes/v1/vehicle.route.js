const express = require('express');
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
} = require('../../controllers/vehicle.controller');

const router = express.Router();

router.route('/create').post(createVehicle);
router.route('/').get(getAllVehicles);
router.route('/:id').get(getVehicleById);
router.route('/:id').patch(updateVehicleById);
router.route('/:id').delete(deleteVehicleById);

module.exports = router;
