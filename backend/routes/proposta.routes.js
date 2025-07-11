// POSIÇÃO DO CÓDIGO: routes/proposta.routes.js

const express = require('express');
const router = express.Router();
const propostaController = require('../controllers/proposta.controller');
const { protect, isEmpresa, canValidate, isEstudante } = require('../middleware/auth.middleware');

// --- ROTA PÚBLICA PARA ESTUDANTES ---
// GET /api/propostas -> Lista todas as propostas validadas.
router.get('/', protect, isEstudante, propostaController.getValidatedProposals);

// --- ROTAS DE GESTÃO (ADMIN / GESTOR) ---
// GET /api/propostas/pendentes -> Lista propostas para validação.
router.get('/pendentes', protect, canValidate, propostaController.getPendingProposals);
// PATCH /api/propostas/:id/validate -> Valida (aprova/rejeita) uma proposta.
router.patch('/:id/validate', protect, canValidate, propostaController.validateProposal);

// --- ROTAS DE ESTUDANTE (ESPECÍFICAS) ---
// GET /api/propostas/recomendadas -> Lista propostas recomendadas para o estudante logado.
router.get('/recomendadas', protect, isEstudante, propostaController.getRecommendedProposals);

// --- ROTAS DE EMPRESA ---
// POST /api/propostas -> Cria uma nova proposta.
router.post('/', protect, isEmpresa, propostaController.createProposal);
// GET /api/propostas/minhas -> Lista as propostas da empresa logada.
router.get('/minhas', protect, isEmpresa, propostaController.getMyProposals);
// GET /api/propostas/:id -> Busca uma proposta específica (para edição).
router.get('/:id', protect, isEmpresa, propostaController.getProposalById);
// PUT /api/propostas/:id -> Atualiza uma proposta.
router.put('/:id', protect, isEmpresa, propostaController.updateProposal);
// PATCH /api/propostas/:id/deactivate -> Desativa uma proposta.
router.patch('/:id/deactivate', protect, isEmpresa, propostaController.deactivateProposal);

router.get('/:id/candidatos', protect, isEmpresa, propostaController.getProposalCandidates);

router.get('/view/:id', protect, isEstudante, propostaController.getSingleValidatedProposal);

module.exports = router;