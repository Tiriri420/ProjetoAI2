const Utilizador = require('../models/user.model');
const bcrypt = require('bcryptjs');

// Admin cria um novo utilizador
exports.createUser = async (req, res) => {
    const { nome, email, password, role } = req.body;

    // Validação básica
    if (!nome || !email || !password || !role) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const userExists = await Utilizador.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'Utilizador com este email já existe.' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const novoUtilizador = await Utilizador.create({
            nome,
            email,
            password_hash,
            role,
        });

        // Não devolvemos o hash da password
        const userResponse = {
            id_utilizador: novoUtilizador.id_utilizador,
            nome: novoUtilizador.nome,
            email: novoUtilizador.email,
            role: novoUtilizador.role,
        };

        res.status(201).json({ message: 'Utilizador criado com sucesso!', user: userResponse });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar utilizador', error: error.message });
    }
};