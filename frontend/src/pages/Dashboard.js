import React from 'react';
import DashboardAdmin from './DashboardAdmin';
// Importa outros dashboards aqui no futuro
// import DashboardEmpresa from './DashboardEmpresa'; 
// import DashboardEstudante from './DashboardEstudante';

const Dashboard = () => {
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    // Se não estiver logado, redireciona para o login
    if (!token) {
        window.location.href = '/login';
        return null; // Retorna null para não renderizar nada enquanto redireciona
    }

    // Decide qual dashboard mostrar com base no role
    switch (userRole) {
        case 'ADMIN':
            return <DashboardAdmin />;
        // case 'EMPRESA':
        //   return <DashboardEmpresa />;
        // case 'ESTUDANTE':
        //   return <DashboardEstudante />;
        default:
            // Se o role for desconhecido ou não tiver dashboard, volta para o login
            window.location.href = '/login';
            return null;
    }
};

export default Dashboard;