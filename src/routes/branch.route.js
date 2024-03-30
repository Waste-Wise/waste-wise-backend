const express = require('express');
const {
  createBranch,
  getAllBranches,
  getBranchById,
  updatebranchById,
  deleteBranchById,
  createDriverForBranch,
  getBranchByIdPopulated,
  createVehicleForBranch,
  getDriversForBranch,
  getVehiclesForBranch,
  assignAdminToBranch,
  unassignAdminFromBranch,
} = require('../controllers/branch.controller');

const router = express.Router();

router.route('/create').post(createBranch);
router.route('/').get(getAllBranches);
router.route('/:id').get(getBranchById);
router.route('/:id').patch(updatebranchById);
router.route('/:id').delete(deleteBranchById);
router.route('/:id/drivers/create').post(createDriverForBranch);
router.route('/:id/vehicles/create').post(createVehicleForBranch);
router.route('/:id/populate').get(getBranchByIdPopulated);
router.route('/:id/drivers').get(getDriversForBranch);
router.route('/:id/vehicles').get(getVehiclesForBranch);
router.route('/:branchId/assign-admin/:adminId').put(assignAdminToBranch);
router.route('/:id/unassign-admin').delete(unassignAdminFromBranch);

module.exports = router;
