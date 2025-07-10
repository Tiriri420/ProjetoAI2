const jwt = require('jsonwebtoken');

// Middleware para verificar se o token é válido
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Adiciona os dados do user (id, role) ao objeto de pedido
            next();
        } catch (error) {
            res.status(401).json({ message: 'Token inválido ou expirado' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Não autorizado, sem token' });
    }
};

// Middleware para verificar se o utilizador é um Admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado. Apenas para administradores.' });
    }
};

module.exports = { protect, isAdmin };