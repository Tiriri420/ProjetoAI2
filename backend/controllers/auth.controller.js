const Utilizador = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registar um novo utilizador
exports.register = async (req, res) => {
    const { nome, email, password, role } = req.body;
    try {
        const password_hash = await bcrypt.hash(password, 10);
        const novoUtilizador = await Utilizador.create({ nome, email, password_hash, role });
        res.status(201).json({ message: 'Utilizador registado com sucesso!', userId: novoUtilizador.id_utilizador });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registar utilizador', error: error.message });
    }
};

// Fazer login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const utilizador = await Utilizador.findOne({ where: { email } });
        if (!utilizador) {
            return res.status(404).json({ message: 'Utilizador não encontrado.' });
        }

        const passwordValida = await bcrypt.compare(password, utilizador.password_hash);
        if (!passwordValida) {
            return res.status(401).json({ message: 'Password inválida.' });
        }

        const token = jwt.sign(
            { id: utilizador.id_utilizador, role: utilizador.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, userId: utilizador.id_utilizador, role: utilizador.role });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
    }
};