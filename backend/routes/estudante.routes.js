// POSIÇÃO DO CÓDIGO: routes/estudante.routes.js

const express = require('express');
const router = express.Router();
const estudanteController = require('../controllers/estudante.controller');
const { protect, isEstudante } = require('../middleware/auth.middleware');

router.get('/me', protect, isEstudante, estudanteController.getMyProfile);
router.put('/me', protect, isEstudante, estudanteController.updateMyProfile);
router.post('/candidaturas/:propostaId', protect, isEstudante, estudanteController.applyToProposal);

module.exports = router;