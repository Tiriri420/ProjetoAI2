const express = require('express');
const router = express.Router();
const propostaController = require('../controllers/proposta.controller');
const { protect, isEmpresa, canValidate, isEstudante } = require('../middleware/auth.middleware');

// --- ROTAS DE ESTUDANTE (MAIS ESPECÍFICAS PRIMEIRO) ---
router.get('/recomendadas', protect, isEstudante, propostaController.getRecommendedProposals);
router.get('/view/:id', protect, isEstudante, propostaController.getSingleValidatedProposal);
router.get('/', protect, isEstudante, propostaController.getValidatedProposals);

// --- ROTAS DE GESTÃO (ADMIN / GESTOR) ---
router.get('/pendentes', protect, canValidate, propostaController.getPendingProposals);
router.get('/validadas', protect, canValidate, propostaController.getAlreadyValidatedProposals);
router.patch('/:id/validate', protect, canValidate, propostaController.validateProposal);

// --- ROTAS DE EMPRESA (MAIS ESPECÍFICAS PRIMEIRO) ---
router.get('/minhas', protect, isEmpresa, propostaController.getMyProposals);
router.post('/', protect, isEmpresa, propostaController.createProposal);

// --- ROTAS GENÉRICAS COM PARÂMETROS (POR ÚLTIMO) ---
router.get('/:id/candidatos', protect, isEmpresa, propostaController.getProposalCandidates);
router.put('/:id', protect, isEmpresa, propostaController.updateProposal);
router.patch('/:id/deactivate', protect, isEmpresa, propostaController.deactivateProposal);
router.get('/:id', protect, isEmpresa, propostaController.getProposalById);

module.exports = router;