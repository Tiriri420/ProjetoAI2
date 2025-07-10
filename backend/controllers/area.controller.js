const { AreaDepartamento } = require('../models');
exports.getAllAreas = async (req, res) => {
    try {
        const areas = await AreaDepartamento.findAll({ order: [['nome', 'ASC']] });
        res.status(200).json(areas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar áreas.' });
    }
};