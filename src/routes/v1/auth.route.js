const express = require('express');
const {
  adminLogin,
  adminCreate,
  refreshAuth,
} = require('../../controllers/auth.controller');

const router = express.Router();

router.route('/login').post(adminLogin);
router.route('/admin/create').post(adminCreate);
router.route('/refresh').post(refreshAuth);

module.exports = router;
