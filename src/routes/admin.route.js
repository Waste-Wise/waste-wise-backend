const express = require('express');
const {
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
} = require('../controllers/admin.controller');

const router = express.Router();

router.route('/').get(getAllAdmins);
router.route('/:id').get(getAdminById);
router.route('/:id').patch(updateAdminById);
router.route('/:id').delete(deleteAdminById);

module.exports = router;
