const express = require('express');
const router = express.Router();
const areaController = require('../controllers/area.controller');
const { protect } = require('../middleware/auth.middleware');
router.get('/', protect, areaController.getAllAreas);
module.exports = router;