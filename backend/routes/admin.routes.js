// POSIÇÃO DO CÓDIGO: routes/admin.routes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');

// Todas as rotas de admin são protegidas e exigem o role de Admin

// Rotas de Competências
router.post('/competencias', protect, isAdmin, adminController.createCompetencia);
router.put('/competencias/:id', protect, isAdmin, adminController.updateCompetencia);
router.delete('/competencias/:id', protect, isAdmin, adminController.deleteCompetencia);

// Rotas de Áreas
router.post('/areas', protect, isAdmin, adminController.createArea);
router.put('/areas/:id', protect, isAdmin, adminController.updateArea);
router.delete('/areas/:id', protect, isAdmin, adminController.deleteArea);

// Rota de Estatísticas
router.get('/stats', protect, isAdmin, adminController.getStats);

// --- Rotas de Gestão de Utilizadores ---
router.get('/users', protect, isAdmin, adminController.getAllUsers);
router.delete('/users/:id', protect, isAdmin, adminController.deleteUser);

module.exports = router;