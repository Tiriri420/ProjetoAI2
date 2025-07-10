// POSIÇÃO DO CÓDIGO: controllers/auth.controller.js

const { Utilizador, PerfilEmpresa, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { nome, email, password, role, nome_empresa } = req.body;

    if (!nome || !email || !password || !role) {
        return res.status(400).json({ message: "Nome, email, password e role são obrigatórios." });
    }
    if (role === 'EMPRESA' && !nome_empresa) {
        return res.status(400).json({ message: "O nome da empresa é obrigatório para o perfil de empresa." });
    }

    const t = await sequelize.transaction();

    try {
        const password_hash = await bcrypt.hash(password, 10);
        const novoUtilizador = await Utilizador.create({
            nome, email, password_hash, role
        }, { transaction: t });

        if (role === 'EMPRESA') {
            await PerfilEmpresa.create({
                utilizador_id: novoUtilizador.id_utilizador,
                nome_empresa: nome_empresa
            }, { transaction: t });
        }
        // No futuro, adicione aqui a lógica para 'ESTUDANTE' e 'GESTOR'

        await t.commit();
        res.status(201).json({ message: 'Utilizador e perfil registados com sucesso!', userId: novoUtilizador.id_utilizador });
    } catch (error) {
        await t.rollback();
        console.error("ERRO NO REGISTO:", error);
        res.status(500).json({ message: 'Erro ao registar utilizador', error: error.message });
    }
};

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
            { expiresIn: '8h' }
        );
        res.status(200).json({ token, userId: utilizador.id_utilizador, role: utilizador.role });
    } catch (error) {
        console.error("ERRO NO LOGIN:", error);
        res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
    }
};