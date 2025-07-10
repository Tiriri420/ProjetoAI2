// /server.js (na raiz do backend)
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./models'); // <-- MUDANÇA: Sem /src

// Importar rotas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const propostaRoutes = require('./routes/proposta.routes');
const competenciaRoutes = require('./routes/competencia.routes');
const estudanteRoutes = require('./routes/estudante.routes');
const areaRoutes = require('./routes/area.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/propostas', propostaRoutes);
app.use('/api/competencias', competenciaRoutes);
app.use('/api/estudantes', estudanteRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/admin', adminRoutes);

// Rota de teste
app.get('/api', (req, res) => {
    res.json({ message: 'Bem-vindo à API da Plataforma ESTGV! Backend está operacional.' });
});

// Sincronizar com a BD e Iniciar o Servidor
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