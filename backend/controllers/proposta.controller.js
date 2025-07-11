const { Proposta, PerfilEstudante, Utilizador, sequelize, Competencia, PerfilEmpresa, AreaDepartamento, PerfilGestor } = require('../models');
const { Op } = require('sequelize');

exports.getPendingProposals = async (req, res) => {
    try {
        let whereClause = { status: 'PENDENTE' };
        let includeClause = [
            { model: PerfilEmpresa, as: 'empresa', attributes: ['nome_empresa'] },
            { model: Competencia, as: 'competencias', attributes: ['nome'], through: { attributes: [] } },
            { model: AreaDepartamento, as: 'areas', attributes: ['nome'], through: { attributes: [] } }
        ];

        if (req.user.role === 'GESTOR') {
            const gestorProfile = await PerfilGestor.findByPk(req.user.id);
            if (!gestorProfile || !gestorProfile.departamento_id) {
                return res.status(200).json([]);
            }
            const areaInclude = includeClause.find(i => i.as === 'areas');
            if (areaInclude) {
                areaInclude.where = { id_area: gestorProfile.departamento_id };
                areaInclude.required = true;
            }
        }

        const propostas = await Proposta.findAll({
            where: whereClause,
            order: [['created_at', 'ASC']],
            include: includeClause
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
        return res.status(400).json({ message: 'Status inválido.' });
    }
    try {
        const proposta = await Proposta.findByPk(id);
        if (!proposta) {
            return res.status(404).json({ message: 'Proposta não encontrada.' });
        }
        await proposta.update({ status: newStatus, validador_id: req.user.id });
        res.status(200).json({ message: `Proposta marcada como ${newStatus.toLowerCase()}.` });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao validar a proposta.' });
    }
};

exports.createProposal = async (req, res) => {
    const empresa_utilizador_id = req.user.id;
    const { titulo, descricao, tipo_proposta, local_de_trabalho, prazo_candidatura, competencias, areas } = req.body;
    const t = await sequelize.transaction();
    try {
        const novaProposta = await Proposta.create({
            empresa_utilizador_id, titulo, descricao, tipo_proposta, local_de_trabalho, prazo_candidatura
        }, { transaction: t });
        if (competencias && competencias.length > 0) await novaProposta.setCompetencias(competencias, { transaction: t });
        if (areas && areas.length > 0) await novaProposta.setAreas(areas, { transaction: t });
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
            include: [{ model: Competencia, as: 'competencias', attributes: ['id_competencia', 'nome'], through: { attributes: [] } }]
        });
        res.status(200).json(propostas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar as propostas.' });
    }
};

exports.getProposalById = async (req, res) => {
    try {
        const { id } = req.params;
        const proposta = await Proposta.findOne({
            where: { id_proposta: id, empresa_utilizador_id: req.user.id },
            include: [
                { model: Competencia, as: 'competencias', attributes: ['id_competencia'], through: { attributes: [] } },
                { model: AreaDepartamento, as: 'areas', attributes: ['id_area'], through: { attributes: [] } }
            ]
        });
        if (!proposta) {
            return res.status(404).json({ message: 'Proposta não encontrada.' });
        }
        res.status(200).json(proposta);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar a proposta.' });
    }
};

exports.updateProposal = async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, tipo_proposta, local_de_trabalho, prazo_candidatura, competencias, areas } = req.body;
    const t = await sequelize.transaction();
    try {
        const proposta = await Proposta.findOne({ where: { id_proposta: id, empresa_utilizador_id: req.user.id } });
        if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada.' });
        await proposta.update({ titulo, descricao, tipo_proposta, local_de_trabalho, prazo_candidatura }, { transaction: t });
        if (competencias && Array.isArray(competencias)) await proposta.setCompetencias(competencias, { transaction: t });
        if (areas && Array.isArray(areas)) await proposta.setAreas(areas, { transaction: t });
        await t.commit();
        res.status(200).json({ message: 'Proposta atualizada com sucesso!' });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: 'Erro interno ao atualizar a proposta.' });
    }
};

exports.deactivateProposal = async (req, res) => {
    const { id } = req.params;
    try {
        const proposta = await Proposta.findOne({ where: { id_proposta: id, empresa_utilizador_id: req.user.id } });
        if (!proposta) {
            return res.status(404).json({ message: 'Proposta não encontrada.' });
        }
        await proposta.update({ status: 'FECHADO' });
        res.status(200).json({ message: 'Proposta desativada com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao desativar a proposta.' });
    }
};

exports.getValidatedProposals = async (req, res) => {
    const { search } = req.query;
    let whereClause = { status: 'VALIDADO' };

    if (search) {
        whereClause[Op.or] = [
            { titulo: { [Op.iLike]: `%${search}%` } },
            { descricao: { [Op.iLike]: `%${search}%` } }
        ];
    }
    
    try {
        const propostas = await Proposta.findAll({
            where: whereClause,
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

exports.getRecommendedProposals = async (req, res) => {
    try {
        const estudanteId = req.user.id;
        const estudante = await PerfilEstudante.findByPk(estudanteId, {
            include: [
                { association: 'habilidades', attributes: ['id_competencia'] },
                { association: 'areasInteresse', attributes: ['id_area'] }
            ]
        });
        if (!estudante) {
            return res.status(404).json({ message: "Perfil de estudante não encontrado." });
        }
        const estudanteCompetenciaIds = new Set(estudante.habilidades.map(c => c.id_competencia));
        const estudanteAreaIds = new Set(estudante.areasInteresse.map(a => a.id_area));
        const todasPropostas = await Proposta.findAll({
            where: { status: 'VALIDADO' },
            include: [
                { association: 'competencias', attributes: ['id_competencia', 'nome'] },
                { association: 'areas', attributes: ['id_area'] },
                { association: 'empresa', attributes: ['nome_empresa'] }
            ]
        });
        const recomendacoes = todasPropostas.map(proposta => {
            let score = 0;
            const propostaCompetenciaIds = new Set(proposta.competencias.map(c => c.id_competencia));
            const propostaAreaIds = new Set(proposta.areas.map(a => a.id_area));
            propostaCompetenciaIds.forEach(id => { if (estudanteCompetenciaIds.has(id)) score += 2; });
            propostaAreaIds.forEach(id => { if (estudanteAreaIds.has(id)) score += 1; });
            return { ...proposta.toJSON(), score };
        })
        .filter(proposta => proposta.score > 0)
        .sort((a, b) => b.score - a.score);
        res.status(200).json(recomendacoes);
    } catch (error) {
        console.error("ERRO AO GERAR RECOMENDAÇÕES:", error);
        res.status(500).json({ message: 'Erro ao gerar recomendações.' });
    }
};

exports.getSingleValidatedProposal = async (req, res) => {
    try {
        const { id } = req.params;
        const proposta = await Proposta.findOne({
            where: { id_proposta: id, status: 'VALIDADO' },
            include: [
                { model: PerfilEmpresa, as: 'empresa', attributes: ['nome_empresa', 'localizacao'] },
                { model: Competencia, as: 'competencias', attributes: ['nome', 'tipo'], through: { attributes: [] } },
                { model: AreaDepartamento, as: 'areas', attributes: ['nome'], through: { attributes: [] } }
            ]
        });
        if (!proposta) {
            return res.status(404).json({ message: "Proposta não encontrada ou não está disponível." });
        }
        res.status(200).json(proposta);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar detalhes da proposta.' });
    }
};

exports.getProposalCandidates = async (req, res) => {
    try {
        const { id } = req.params;
        const empresaId = req.user.id;
        const proposta = await Proposta.findByPk(id);
        if (!proposta) {
            return res.status(404).json({ message: "Proposta não encontrada." });
        }
        if (proposta.empresa_utilizador_id !== empresaId) {
            return res.status(403).json({ message: "Não tem permissão para ver os candidatos desta proposta." });
        }
        const candidatos = await proposta.getCandidatos({
            attributes: ['curso', 'ano_conclusao'],
            include: [
                { model: Utilizador, attributes: ['id_utilizador', 'nome', 'email'] },
                { model: Competencia, as: 'habilidades', attributes: ['nome'], through: { attributes: [] } }
            ]
        });
        res.status(200).json(candidatos);
    } catch (error) {
        console.error("ERRO AO BUSCAR CANDIDATOS:", error);
        res.status(500).json({ message: 'Erro ao buscar candidatos da proposta.' });
    }
};

exports.getAlreadyValidatedProposals = async (req, res) => {
    try {
        const propostas = await Proposta.findAll({
            where: {
                status: { [Op.in]: ['VALIDADO', 'REJEITADO'] }
            },
            order: [['updated_at', 'DESC']]
        });
        res.status(200).json(propostas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar histórico de validações.' });
    }
};