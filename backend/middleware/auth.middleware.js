// /src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token inválido ou expirado' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Não autorizado, sem token' });
    }
};

const isAdmin = (req, res, next) => (req.user && req.user.role === 'ADMIN') ? next() : res.status(403).json({ message: 'Acesso negado. Apenas para administradores.' });
const isEmpresa = (req, res, next) => (req.user && req.user.role === 'EMPRESA') ? next() : res.status(403).json({ message: 'Acesso negado. Apenas para empresas.' });
// (No futuro, adicione isGestor e isEstudante aqui)

module.exports = { protect, isAdmin, isEmpresa };