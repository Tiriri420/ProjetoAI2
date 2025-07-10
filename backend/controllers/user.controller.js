// POSIÇÃO DO CÓDIGO: controllers/user.controller.js

const { Utilizador, PerfilEmpresa, PerfilGestor, PerfilEstudante, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
    // Agora o formulário enviará dados extras dependendo do role
    const { nome, email, password, role, nome_empresa, departamento_id, curso, ano_conclusao } = req.body;

    if (!nome || !email || !password || !role) {
        return res.status(400).json({ message: 'Nome, email, password e role são obrigatórios.' });
    }

    const t = await sequelize.transaction();

    try {
        const userExists = await Utilizador.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'Utilizador com este email já existe.' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const novoUtilizador = await Utilizador.create({
            nome, email, password_hash, role,
        }, { transaction: t });

        // Criar o perfil correspondente ao role
        if (role === 'EMPRESA') {
            if (!nome_empresa) throw new Error('Nome da empresa é obrigatório.');
            await PerfilEmpresa.create({ utilizador_id: novoUtilizador.id_utilizador, nome_empresa }, { transaction: t });
        } else if (role === 'GESTOR') {
            if (!departamento_id) throw new Error('Departamento é obrigatório.');
            await PerfilGestor.create({ utilizador_id: novoUtilizador.id_utilizador, departamento_id }, { transaction: t });
        } else if (role === 'ESTUDANTE') {
            await PerfilEstudante.create({ utilizador_id: novoUtilizador.id_utilizador, curso, ano_conclusao }, { transaction: t });
        }

        await t.commit();
        
        const userResponse = { id_utilizador: novoUtilizador.id_utilizador, nome, email, role };
        res.status(201).json({ message: 'Utilizador e perfil criados com sucesso!', user: userResponse });

    } catch (error) {
        await t.rollback();
        console.error("ERRO AO CRIAR UTILIZADOR:", error);
        res.status(500).json({ message: 'Erro ao criar utilizador', error: error.message });
    }
};