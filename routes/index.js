const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Define routes
router.get('/', apiController.home);

module.exports = router;
