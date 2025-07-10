const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AreaDepartamento = sequelize.define('AreaDepartamento', {
    id_area: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(100), allowNull: false, unique: true }
}, { tableName: 'areas_departamento', timestamps: false });

module.exports = AreaDepartamento;