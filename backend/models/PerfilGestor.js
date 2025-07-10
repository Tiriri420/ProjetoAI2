const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PerfilGestor = sequelize.define('PerfilGestor', {
    utilizador_id: { type: DataTypes.INTEGER, primaryKey: true },
    departamento_id: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'perfis_gestor', timestamps: false });

module.exports = PerfilGestor;