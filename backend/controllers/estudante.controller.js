const { PerfilEstudante, Competencia, AreaDepartamento, Proposta, Candidatura, sequelize } = require('../models');

exports.getMyProfile = async (req, res) => {
    try {
        const profile = await PerfilEstudante.findOne({
            where: { utilizador_id: req.user.id },
            include: [
                { model: Competencia, as: 'habilidades', through: { attributes: [] } },
                { model: AreaDepartamento, as: 'areasInteresse', through: { attributes: [] } },
                {
                    model: Proposta,
                    as: 'propostasCandidatadas',
                    attributes: ['id_proposta'],
                    // Trazemos os dados da tabela de junção explicitamente
                    through: {
                        as: 'candidaturaInfo',
                        attributes: ['status']
                    }
                }
            ]
        });
        if (!profile) return res.status(404).json({ message: 'Perfil de estudante não encontrado.' });
        res.status(200).json(profile);
    } catch (error) {
        console.error("ERRO AO BUSCAR PERFIL:", error);
        res.status(500).json({ message: 'Erro ao buscar o perfil.' });
    }
};

exports.updateMyProfile = async (req, res) => {
    const { curso, ano_conclusao, habilidades, areasInteresse } = req.body;
    const t = await sequelize.transaction();
    try {
        const profile = await PerfilEstudante.findByPk(req.user.id);
        if (!profile) return res.status(404).json({ message: 'Perfil de estudante não encontrado.' });
        
        await profile.update({ curso, ano_conclusao }, { transaction: t });
        
        if (habilidades && Array.isArray(habilidades)) await profile.setHabilidades(habilidades, { transaction: t });
        if (areasInteresse && Array.isArray(areasInteresse)) await profile.setAreasInteresse(areasInteresse, { transaction: t });
        
        await t.commit();
        res.status(200).json({ message: 'Perfil atualizado com sucesso!' });
    } catch (error) {
        await t.rollback();
        console.error("ERRO AO ATUALIZAR PERFIL DE ESTUDANTE:", error);
        res.status(500).json({ message: 'Erro ao atualizar o perfil.' });
    }
};

exports.applyToProposal = async (req, res) => {
    try {
        const { propostaId } = req.params;
        const estudanteId = req.user.id;

        await Candidatura.create({
            estudante_utilizador_id: estudanteId,
            proposta_id: propostaId
        });
        
        res.status(200).json({ message: 'Candidatura submetida com sucesso!' });

    } catch (error) {
        console.error("ERRO AO APLICAR A PROPOSTA:", error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Já se candidatou a esta proposta.' });
        }
        res.status(500).json({ message: 'Erro ao submeter a candidatura.' });
    }
};