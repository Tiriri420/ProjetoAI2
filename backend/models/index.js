// POSIÇÃO DO CÓDIGO: models/index.js

const sequelize = require('../config/database');

const db = {};
db.sequelize = sequelize;

// Importar modelos
db.Utilizador = require('./user.model');
db.PerfilEmpresa = require('./PerfilEmpresa');
db.Proposta = require('./Proposta');
db.Competencia = require('./Competencia');
db.AreaDepartamento = require('./AreaDepartamento');

// --- Definir Associações ---

// Utilizador <-> PerfilEmpresa (1-para-1)
db.Utilizador.hasOne(db.PerfilEmpresa, { foreignKey: 'utilizador_id', onDelete: 'CASCADE' });
db.PerfilEmpresa.belongsTo(db.Utilizador, { foreignKey: 'utilizador_id' });

// PerfilEmpresa -> Proposta (1-para-Muitos)
db.PerfilEmpresa.hasMany(db.Proposta, { foreignKey: 'empresa_utilizador_id' });
db.Proposta.belongsTo(db.PerfilEmpresa, { as: 'empresa', foreignKey: 'empresa_utilizador_id' });

// =======================================================================
//                           A CORREÇÃO ESTÁ AQUI
// =======================================================================
// Proposta <-> Competencia (Muitos-para-Muitos)
db.Proposta.belongsToMany(db.Competencia, {
    through: 'proposta_competencias',
    as: 'competencias', // <-- Damos um apelido à relação
    foreignKey: 'proposta_id',
    otherKey: 'competencia_id',
    timestamps: false
});
db.Competencia.belongsToMany(db.Proposta, {
    through: 'proposta_competencias',
    as: 'propostas', // <-- Damos um apelido à relação inversa
    foreignKey: 'competencia_id',
    otherKey: 'proposta_id',
    timestamps: false
});
// =======================================================================

// Proposta <-> AreaDepartamento (Muitos-para-Muitos)
db.Proposta.belongsToMany(db.AreaDepartamento, { through: 'proposta_areas', as: 'areas', foreignKey: 'proposta_id', otherKey: 'area_id', timestamps: false });
db.AreaDepartamento.belongsToMany(db.Proposta, { through: 'proposta_areas', as: 'propostasArea', foreignKey: 'area_id', otherKey: 'proposta_id', timestamps: false });

module.exports = db;