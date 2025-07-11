const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresa.controller');
const { protect, isEmpresa } = require('../middleware/auth.middleware');

router.patch('/candidaturas/:propostaId/:estudanteId', protect, isEmpresa, empresaController.decideOnCandidate);

module.exports = router;