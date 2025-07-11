const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PerfilEmpresa = sequelize.define('PerfilEmpresa', {
    utilizador_id: { type: DataTypes.INTEGER, primaryKey: true },
    nome_empresa: { type: DataTypes.STRING, allowNull: false },
    localizacao: { type: DataTypes.STRING },
}, { tableName: 'perfis_empresa', timestamps: false });

module.exports = PerfilEmpresa;