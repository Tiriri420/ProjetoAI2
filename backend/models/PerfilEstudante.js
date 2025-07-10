// POSIÇÃO DO CÓDIGO: models/PerfilEstudante.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PerfilEstudante = sequelize.define('PerfilEstudante', {
    utilizador_id: { type: DataTypes.INTEGER, primaryKey: true },
    curso: { type: DataTypes.STRING },
    ano_conclusao: { type: DataTypes.INTEGER }
}, { tableName: 'perfis_estudante', timestamps: false });

module.exports = PerfilEstudante;