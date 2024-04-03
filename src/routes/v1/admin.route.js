const express = require('express');
const {
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
} = require('../../controllers/admin.controller');

const router = express.Router();

router.route('/').get(getAllAdmins);
router
  .route('/:id')
  .get(getAdminById)
  .patch(updateAdminById)
  .delete(deleteAdminById);

module.exports = router;
