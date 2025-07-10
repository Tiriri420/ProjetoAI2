// /src/routes/competencia.routes.js
const express = require('express');
const router = express.Router();
const competenciaController = require('../controllers/competencia.controller');
const { protect } = require('../middleware/auth.middleware');

// Protegida para que só utilizadores logados possam ver as competências
router.get('/', protect, competenciaController.getAllCompetencias);

module.exports = router;