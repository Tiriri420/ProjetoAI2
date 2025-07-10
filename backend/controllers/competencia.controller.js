const { Competencia } = require('../models');

exports.getAllCompetencias = async (req, res) => {
    try {
        const competencias = await Competencia.findAll({
            order: [['tipo', 'ASC'],['nome', 'ASC']]
        });
        res.status(200).json(competencias);
    } catch (error) {
        console.error("ERRO NO CONTROLLER DE COMPETENCIAS:", error);
        res.status(500).json({ message: 'Erro ao buscar competências', error: error.message });
    }
};