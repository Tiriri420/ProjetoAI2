const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Utilizador = sequelize.define('Utilizador', {
    id_utilizador: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('ADMIN', 'GESTOR', 'EMPRESA', 'ESTUDANTE'),
        allowNull: false,
    },
}, {
    tableName: 'utilizadores', // Nome exato da tabela na BD
    timestamps: false, // Se não tiveres colunas createdAt, updatedAt
});

module.exports = Utilizador;