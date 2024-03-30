const express = require('express');
const { adminLogin, adminCreate } = require('../../controllers/auth.controller');

const router = express.Router();

router.route('/admin/login').post(adminLogin);
router.route('/admin/create').post(adminCreate);

module.exports = router;
