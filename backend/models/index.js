// POSIÇÃO DO CÓDIGO: models/index.js (VERSÃO COMPLETA ATUALIZADA)

const sequelize = require('../config/database');

const db = {};
db.sequelize = sequelize;

// Importar todos os modelos
db.Utilizador = require('./user.model');
db.PerfilEmpresa = require('./PerfilEmpresa');
db.PerfilGestor = require('./PerfilGestor'); // <-- NOVO
db.Proposta = require('./Proposta');
db.Competencia = require('./Competencia');
db.AreaDepartamento = require('./AreaDepartamento');

// --- Associações de Perfil ---
db.Utilizador.hasOne(db.PerfilEmpresa, { foreignKey: 'utilizador_id', onDelete: 'CASCADE' });
db.PerfilEmpresa.belongsTo(db.Utilizador, { foreignKey: 'utilizador_id' });

db.Utilizador.hasOne(db.PerfilGestor, { foreignKey: 'utilizador_id', onDelete: 'CASCADE' }); // <-- NOVO
db.PerfilGestor.belongsTo(db.Utilizador, { foreignKey: 'utilizador_id' }); // <-- NOVO

db.AreaDepartamento.hasMany(db.PerfilGestor, { foreignKey: 'departamento_id' }); // <-- NOVO
db.PerfilGestor.belongsTo(db.AreaDepartamento, { as: 'departamento', foreignKey: 'departamento_id' }); // <-- NOVO

// --- Associações de Proposta ---
db.PerfilEmpresa.hasMany(db.Proposta, { foreignKey: 'empresa_utilizador_id' });
db.Proposta.belongsTo(db.PerfilEmpresa, { as: 'empresa', foreignKey: 'empresa_utilizador_id' });

db.Utilizador.hasMany(db.Proposta, { as: 'propostasValidadas', foreignKey: 'validador_id' }); // <-- NOVO
db.Proposta.belongsTo(db.Utilizador, { as: 'validador', foreignKey: 'validador_id' }); // <-- NOVO

// --- Associações Muitos-para-Muitos ---
db.Proposta.belongsToMany(db.Competencia, { through: 'proposta_competencias', as: 'competencias', foreignKey: 'proposta_id', otherKey: 'competencia_id', timestamps: false });
db.Competencia.belongsToMany(db.Proposta, { through: 'proposta_competencias', as: 'propostas', foreignKey: 'competencia_id', otherKey: 'proposta_id', timestamps: false });

db.Proposta.belongsToMany(db.AreaDepartamento, { through: 'proposta_areas', as: 'areas', foreignKey: 'proposta_id', otherKey: 'area_id', timestamps: false });
db.AreaDepartamento.belongsToMany(db.Proposta, { through: 'proposta_areas', as: 'propostasArea', foreignKey: 'area_id', otherKey: 'proposta_id', timestamps: false });

module.exports = db;