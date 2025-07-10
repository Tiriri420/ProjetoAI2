// POSIÇÃO DO CÓDIGO: controllers/proposta.controller.js

const { Proposta, sequelize, Competencia, PerfilEmpresa, PerfilGestor, AreaDepartamento } = require('../models');

// ===================================
// Funções de Gestor/Admin
// ===================================

exports.getPendingProposals = async (req, res) => {
    try {
        let whereClause = { status: 'PENDENTE' };

        // Lógica de filtro para o futuro: Se o user for um gestor, filtrar pelas áreas do seu departamento.
        // if (req.user.role === 'GESTOR') { ... }

        const propostas = await Proposta.findAll({
            where: whereClause,
            order: [['created_at', 'ASC']],
            include: [
                {
                    model: PerfilEmpresa,
                    as: 'empresa',
                    attributes: ['nome_empresa']
                },
                {
                    model: Competencia,
                    as: 'competencias',
                    attributes: ['nome'],
                    through: { attributes: [] }
                }
            ]
        });
        res.status(200).json(propostas);
    } catch (error) {
        console.error("ERRO AO BUSCAR PROPOSTAS PENDENTES:", error);
        res.status(500).json({ message: 'Erro ao buscar propostas pendentes.' });
    }
};

exports.validateProposal = async (req, res) => {
    const { id } = req.params;
    const { newStatus } = req.body;

    if (!['VALIDADO', 'REJEITADO'].includes(newStatus)) {
        return res.status(400).json({ message: 'Status de validação inválido. Use VALIDADO ou REJEITADO.' });
    }

    try {
        const proposta = await Proposta.findByPk(id);
        if (!proposta) {
            return res.status(404).json({ message: 'Proposta não encontrada.' });
        }

        // TODO: Adicionar lógica para garantir que um GESTOR só pode validar propostas do seu departamento.

        await proposta.update({
            status: newStatus,
            validador_id: req.user.id
        });

        res.status(200).json({ message: `Proposta marcada como ${newStatus.toLowerCase()} com sucesso.` });
    } catch (error) {
        console.error("ERRO AO VALIDAR PROPOSTA:", error);
        res.status(500).json({ message: 'Erro ao validar a proposta.' });
    }
};


// ===================================
// Funções de Empresa
// ===================================

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
        console.error('ERRO AO CRIAR PROPOSTA:', error);
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
        console.error('ERRO AO BUSCAR MINHAS PROPOSTAS:', error);
        res.status(500).json({ message: 'Erro ao buscar as propostas.' });
    }
};

exports.getProposalById = async (req, res) => {
    try {
        const { id } = req.params;
        const proposta = await Proposta.findOne({
            where: { id_proposta: id, empresa_utilizador_id: req.user.id },
            include: [{
                model: Competencia,
                as: 'competencias',
                attributes: ['id_competencia'],
                through: { attributes: [] }
            }]
        });
        if (!proposta) {
            return res.status(404).json({ message: 'Proposta não encontrada ou não pertence a esta empresa.' });
        }
        res.status(200).json(proposta);
    } catch (error) {
        console.error('ERRO AO BUSCAR PROPOSTA POR ID:', error);
        res.status(500).json({ message: 'Erro ao buscar a proposta.' });
    }
};

exports.updateProposal = async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, tipo_proposta, local_de_trabalho, prazo_candidatura, competencias } = req.body;
    const t = await sequelize.transaction();
    try {
        const proposta = await Proposta.findOne({ where: { id_proposta: id, empresa_utilizador_id: req.user.id } });
        if (!proposta) {
            await t.rollback();
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
        console.error('ERRO AO DESATIVAR PROPOSTA:', error);
        res.status(500).json({ message: 'Erro ao desativar a proposta.' });
    }
};

exports.getValidatedProposals = async (req, res) => {
    try {
        const propostas = await Proposta.findAll({
            where: { status: 'VALIDADO' },
            order: [['created_at', 'DESC']],
            include: [
                { model: PerfilEmpresa, as: 'empresa', attributes: ['nome_empresa'] },
                { model: Competencia, as: 'competencias', attributes: ['nome'], through: { attributes: [] } }
            ]
        });
        res.status(200).json(propostas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar propostas validadas.' });
    }
};