const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Proposta = sequelize.define('Proposta', {
    id_proposta: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    empresa_utilizador_id: { type: DataTypes.INTEGER, allowNull: false },
    validador_id: { type: DataTypes.INTEGER, allowNull: true },
    titulo: { type: DataTypes.STRING(255), allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: false },
    tipo_proposta: { type: DataTypes.ENUM('EMPREGO', 'ESTAGIO', 'PROJETO'), allowNull: false },
    local_de_trabalho: { type: DataTypes.STRING(255) },
    prazo_candidatura: { type: DataTypes.DATE },
    status: { type: DataTypes.ENUM('PENDENTE', 'VALIDADO', 'FECHADO', 'REJEITADO'), allowNull: false, defaultValue: 'PENDENTE' }
}, { 
    tableName: 'propostas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Proposta;