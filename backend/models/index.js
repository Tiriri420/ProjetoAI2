const sequelize = require('../config/database');

const db = {};
db.sequelize = sequelize;

db.Utilizador = require('./user.model');
db.PerfilEmpresa = require('./PerfilEmpresa');
db.PerfilGestor = require('./PerfilGestor');
db.PerfilEstudante = require('./PerfilEstudante');
db.Proposta = require('./Proposta');
db.Competencia = require('./Competencia');
db.AreaDepartamento = require('./AreaDepartamento');
db.Candidatura = require('./Candidatura');

db.Utilizador.hasOne(db.PerfilEmpresa, { foreignKey: 'utilizador_id', onDelete: 'CASCADE' });
db.PerfilEmpresa.belongsTo(db.Utilizador, { foreignKey: 'utilizador_id' });
db.Utilizador.hasOne(db.PerfilGestor, { foreignKey: 'utilizador_id', onDelete: 'CASCADE' });
db.PerfilGestor.belongsTo(db.Utilizador, { foreignKey: 'utilizador_id' });
db.Utilizador.hasOne(db.PerfilEstudante, { foreignKey: 'utilizador_id', onDelete: 'CASCADE' });
db.PerfilEstudante.belongsTo(db.Utilizador, { foreignKey: 'utilizador_id' });

db.AreaDepartamento.hasMany(db.PerfilGestor, { foreignKey: 'departamento_id' });
db.PerfilGestor.belongsTo(db.AreaDepartamento, { as: 'departamento', foreignKey: 'departamento_id' });
db.PerfilEmpresa.hasMany(db.Proposta, { foreignKey: 'empresa_utilizador_id' });
db.Proposta.belongsTo(db.PerfilEmpresa, { as: 'empresa', foreignKey: 'empresa_utilizador_id' });
db.Utilizador.hasMany(db.Proposta, { as: 'propostasValidadas', foreignKey: 'validador_id' });
db.Proposta.belongsTo(db.Utilizador, { as: 'validador', foreignKey: 'validador_id' });

db.Proposta.belongsToMany(db.Competencia, { through: 'proposta_competencias', as: 'competencias', foreignKey: 'proposta_id', timestamps: false });
db.Competencia.belongsToMany(db.Proposta, { through: 'proposta_competencias', as: 'propostas', foreignKey: 'competencia_id', timestamps: false });
db.Proposta.belongsToMany(db.AreaDepartamento, { through: 'proposta_areas', as: 'areas', foreignKey: 'proposta_id', timestamps: false });
db.AreaDepartamento.belongsToMany(db.Proposta, { through: 'proposta_areas', as: 'propostasArea', foreignKey: 'area_id', timestamps: false });
db.PerfilEstudante.belongsToMany(db.Competencia, { through: 'estudante_competencias', as: 'habilidades', foreignKey: 'estudante_utilizador_id', timestamps: false });
db.Competencia.belongsToMany(db.PerfilEstudante, { through: 'estudante_competencias', as: 'estudantesComHabilidade', foreignKey: 'competencia_id', timestamps: false });
db.PerfilEstudante.belongsToMany(db.AreaDepartamento, { through: 'estudante_areas_interesse', as: 'areasInteresse', foreignKey: 'estudante_utilizador_id', timestamps: false });
db.AreaDepartamento.belongsToMany(db.PerfilEstudante, { through: 'estudante_areas_interesse', as: 'estudantesInteressados', foreignKey: 'area_id', timestamps: false });

db.PerfilEstudante.belongsToMany(db.Proposta, {
    through: db.Candidatura,
    as: 'propostasCandidatadas',
    foreignKey: 'estudante_utilizador_id',
});
db.Proposta.belongsToMany(db.PerfilEstudante, {
    through: db.Candidatura,
    as: 'candidatos',
    foreignKey: 'proposta_id',
});

module.exports = db;