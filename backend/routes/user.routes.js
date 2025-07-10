const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');

// Rota para criar um utilizador - Protegida por token e pelo role de admin
router.post('/create', protect, isAdmin, userController.createUser);

module.exports = router;