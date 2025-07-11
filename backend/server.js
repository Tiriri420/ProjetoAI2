const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./models');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const propostaRoutes = require('./routes/proposta.routes');
const competenciaRoutes = require('./routes/competencia.routes');
const areaRoutes = require('./routes/area.routes');
const estudanteRoutes = require('./routes/estudante.routes');
const adminRoutes = require('./routes/admin.routes');
const empresaRoutes = require('./routes/empresa.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/propostas', propostaRoutes);
app.use('/api/competencias', competenciaRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/estudantes', estudanteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/empresas', empresaRoutes);

app.get('/api', (req, res) => {
    res.json({ message: 'Bem-vindo à API da Plataforma ESTGV! Backend está operacional.' });
});

db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Base de dados sincronizada com sucesso.');
        app.listen(PORT, () => {
            console.log(`Servidor a correr na porta ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Não foi possível sincronizar a base de dados:', err);
    });