const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/user.routes');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // Permite pedidos de outros domínios
app.use(express.json()); // Permite ao Express ler JSON do body dos pedidos
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);

// Rotas da API
app.get('/api', (req, res) => {
    res.json({ message: 'Bem-vindo à API da Plataforma ESTGV!' });
});

app.use('/api/auth', authRoutes); // Usa as rotas de autenticação

// Sincronizar com a BD e Iniciar o Servidor
sequelize.authenticate()
    .then(() => {
        console.log('Ligação à base de dados estabelecida com sucesso.');
        app.listen(PORT, () => {
            console.log(`Servidor a correr na porta ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Não foi possível ligar à base de dados:', err);
    });