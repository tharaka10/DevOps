const express = require('express');
const router = express.Router();
const {
  updateCompanyDetails,
  getCompanyDetails,
} = require('../controllers/company.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');

// using HTTP PUT method for updates
router.get('/', authenticateJWT, getCompanyDetails);
router.put('/update-details', authenticateJWT, updateCompanyDetails);

module.exports = router;
