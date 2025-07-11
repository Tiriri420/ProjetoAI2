const { Competencia, AreaDepartamento, Utilizador, Proposta, sequelize } = require('../models');

// --- Gestão de Competências ---
exports.createCompetencia = async (req, res) => {
    try {
        const competencia = await Competencia.create(req.body);
        res.status(201).json(competencia);
    } catch (error) { res.status(400).json({ message: 'Erro ao criar competência.', error }); }
};
exports.updateCompetencia = async (req, res) => {
    try {
        const [updated] = await Competencia.update(req.body, { where: { id_competencia: req.params.id } });
        if (updated) res.status(200).json({ message: 'Competência atualizada.' });
        else res.status(404).json({ message: 'Competência não encontrada.' });
    } catch (error) { res.status(400).json({ message: 'Erro ao atualizar competência.', error }); }
};
exports.deleteCompetencia = async (req, res) => {
    try {
        const deleted = await Competencia.destroy({ where: { id_competencia: req.params.id } });
        if (deleted) res.status(204).send();
        else res.status(404).json({ message: 'Competência não encontrada.' });
    } catch (error) { res.status(500).json({ message: 'Erro ao apagar competência.', error }); }
};

// --- Gestão de Áreas/Departamentos ---
exports.createArea = async (req, res) => {
    try {
        const area = await AreaDepartamento.create(req.body);
        res.status(201).json(area);
    } catch (error) { res.status(400).json({ message: 'Erro ao criar área.', error }); }
};
exports.updateArea = async (req, res) => {
    try {
        const [updated] = await AreaDepartamento.update(req.body, { where: { id_area: req.params.id } });
        if (updated) res.status(200).json({ message: 'Área atualizada.' });
        else res.status(404).json({ message: 'Área não encontrada.' });
    } catch (error) { res.status(400).json({ message: 'Erro ao atualizar área.', error }); }
};
exports.deleteArea = async (req, res) => {
    try {
        const deleted = await AreaDepartamento.destroy({ where: { id_area: req.params.id } });
        if (deleted) res.status(204).send();
        else res.status(404).json({ message: 'Área não encontrada.' });
    } catch (error) { res.status(500).json({ message: 'Erro ao apagar área.', error }); }
};

// --- Estatísticas ---
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await Utilizador.count();
        const totalPropostas = await Proposta.count();
        const pendingPropostas = await Proposta.count({ where: { status: 'PENDENTE' } });
        const totalEmpresas = await Utilizador.count({ where: { role: 'EMPRESA' }});

        res.status(200).json({ totalUsers, totalPropostas, pendingPropostas, totalEmpresas });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar estatísticas.' });
    }
};
// --- Gestão de Utilizadores ---

exports.getAllUsers = async (req, res) => {
    try {
        const users = await Utilizador.findAll({
            attributes: ['id_utilizador', 'nome', 'email', 'role', 'created_at'], // Não enviar o hash da password
            order: [['created_at', 'DESC']]
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar utilizadores.' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        // Prevenir que o admin se apague a si mesmo
        if (parseInt(req.params.id) === req.user.id) {
            return res.status(403).json({ message: 'Não pode apagar a sua própria conta de administrador.' });
        }

        const deleted = await Utilizador.destroy({ where: { id_utilizador: req.params.id } });
        
        // Graças ao ON DELETE CASCADE na BD e nos modelos, os perfis associados serão apagados automaticamente.
        
        if (deleted) {
            res.status(204).send(); // Sucesso, sem conteúdo para enviar
        } else {
            res.status(404).json({ message: 'Utilizador não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao apagar utilizador.', error });
    }
};