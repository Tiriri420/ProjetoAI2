const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Candidatura = sequelize.define('Candidatura', {
    proposta_id: { type: DataTypes.INTEGER, primaryKey: true },
    estudante_utilizador_id: { type: DataTypes.INTEGER, primaryKey: true },
    status: {
        type: DataTypes.ENUM('PENDENTE', 'ACEITE', 'REJEITADO'),
        defaultValue: 'PENDENTE',
        allowNull: false
    }
}, { tableName: 'candidaturas', timestamps: true, createdAt: 'data_candidatura', updatedAt: false });

module.exports = Candidatura;