// POSIÇÃO DO CÓDIGO: controllers/proposta.controller.js

const { Proposta, sequelize, Competencia } = require('../models');

// Função para buscar uma única proposta pelo seu ID
exports.getProposalById = async (req, res) => {
    try {
        const { id } = req.params;
        const proposta = await Proposta.findOne({
            where: { id_proposta: id, empresa_utilizador_id: req.user.id }, // Garante que a empresa só pode buscar a sua própria proposta
            include: [{
                model: Competencia,
                as: 'competencias',
                attributes: ['id_competencia'], // Só precisamos dos IDs para preencher os checkboxes
                through: { attributes: [] }
            }]
        });

        if (!proposta) {
            return res.status(404).json({ message: 'Proposta não encontrada ou não pertence a esta empresa.' });
        }
        res.status(200).json(proposta);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar a proposta.' });
    }
};

// Função para ATUALIZAR uma proposta
exports.updateProposal = async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, tipo_proposta, local_de_trabalho, prazo_candidatura, competencias } = req.body;
    
    const t = await sequelize.transaction();
    try {
        const proposta = await Proposta.findOne({ where: { id_proposta: id, empresa_utilizador_id: req.user.id } });

        if (!proposta) {
            return res.status(404).json({ message: 'Proposta não encontrada ou não pertence a esta empresa.' });
        }

        await proposta.update({
            titulo, descricao, tipo_proposta, local_de_trabalho, prazo_candidatura
        }, { transaction: t });

        if (competencias && Array.isArray(competencias)) {
            await proposta.setCompetencias(competencias, { transaction: t });
        }

        await t.commit();
        res.status(200).json({ message: 'Proposta atualizada com sucesso!' });
    } catch (error) {
        await t.rollback();
        console.error('ERRO AO ATUALIZAR PROPOSTA:', error);
        res.status(500).json({ message: 'Erro interno ao atualizar a proposta.' });
    }
};

// Função para DESATIVAR uma proposta
exports.deactivateProposal = async (req, res) => {
    const { id } = req.params;
    try {
        const proposta = await Proposta.findOne({ where: { id_proposta: id, empresa_utilizador_id: req.user.id } });
        
        if (!proposta) {
            return res.status(404).json({ message: 'Proposta não encontrada ou não pertence a esta empresa.' });
        }

        await proposta.update({ status: 'FECHADO' });
        res.status(200).json({ message: 'Proposta desativada com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao desativar a proposta.' });
    }
};


// --- Funções que já tínhamos ---
exports.createProposal = async (req, res) => {
    const empresa_utilizador_id = req.user.id;
    const { titulo, descricao, tipo_proposta, local_de_trabalho, prazo_candidatura, competencias } = req.body;
    const t = await sequelize.transaction();
    try {
        const novaProposta = await Proposta.create({
            empresa_utilizador_id, titulo, descricao, tipo_proposta, local_de_trabalho, prazo_candidatura
        }, { transaction: t });
        if (competencias && competencias.length > 0) {
            await novaProposta.setCompetencias(competencias, { transaction: t });
        }
        await t.commit();
        res.status(201).json({ message: 'Proposta criada com sucesso!', proposta: novaProposta });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: 'Erro interno ao criar a proposta.' });
    }
};

exports.getMyProposals = async (req, res) => {
    try {
        const propostas = await Proposta.findAll({
            where: { empresa_utilizador_id: req.user.id },
            order: [['created_at', 'DESC']],
            include: [{
                model: Competencia,
                as: 'competencias',
                attributes: ['id_competencia', 'nome'],
                through: { attributes: [] }
            }]
        });
        res.status(200).json(propostas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar as propostas.' });
    }
};