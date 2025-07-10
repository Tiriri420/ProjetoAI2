import React from 'react';
import DashboardAdmin from './DashboardAdmin';
import DashboardEmpresa from './DashboardEmpresa';   // <-- Importar
import DashboardGestor from './DashboardGestor';     // <-- Importar
import DashboardEstudante from './DashboardEstudante'; // <-- Importar
import { Navigate } from 'react-router-dom'; // Usar Navigate para redirecionar

const Dashboard = () => {
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    // Se não estiver logado, redireciona para o login de forma segura
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Decide qual dashboard mostrar com base no role
    switch (userRole) {
        case 'ADMIN':
            return <DashboardAdmin />;
        case 'EMPRESA':
            return <DashboardEmpresa />;
        case 'GESTOR':
            return <DashboardGestor />;
        case 'ESTUDANTE':
            return <DashboardEstudante />;
        default:
            // Se o role for desconhecido, volta para o login
            return <Navigate to="/login" />;
    }
};

export default Dashboard;