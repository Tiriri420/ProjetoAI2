// POSIÇÃO DO CÓDIGO: routes/proposta.routes.js

const express = require('express');
const router = express.Router();
const propostaController = require('../controllers/proposta.controller');
const { protect, isEmpresa } = require('../middleware/auth.middleware');

// Criar uma nova proposta
router.post('/', protect, isEmpresa, propostaController.createProposal);

// Buscar todas as propostas da empresa logada
router.get('/minhas', protect, isEmpresa, propostaController.getMyProposals);

// Buscar UMA proposta específica pelo ID (para o formulário de edição)
router.get('/:id', protect, isEmpresa, propostaController.getProposalById);

// Atualizar uma proposta
router.put('/:id', protect, isEmpresa, propostaController.updateProposal);

// Desativar uma proposta (mudar status para 'FECHADO')
router.patch('/:id/deactivate', protect, isEmpresa, propostaController.deactivateProposal);

module.exports = router;