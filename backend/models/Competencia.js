const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Competencia = sequelize.define('Competencia', {
    id_competencia: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    tipo: { type: DataTypes.ENUM('TECNICA', 'SOFTSKILL'), allowNull: false }
}, { tableName: 'competencias', timestamps: false });

module.exports = Competencia;