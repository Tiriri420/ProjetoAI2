import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import AdicionarUtilizador from '../components/AdicionarUtilizador';

const DashboardAdmin = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    };

    return (
        <Container fluid className="mt-4">
            <Row className="align-items-center mb-4">
                <Col>
                    <h1>Dashboard do Administrador</h1>
                </Col>
                <Col className="text-end">
                    <Button variant="danger" onClick={handleLogout}>Logout</Button>
                </Col>
            </Row>

            <p>Bem-vindo à área de administração. Aqui pode gerir utilizadores, propostas e outras configurações da plataforma.</p>

            <Row className="mt-5">
                <Col>
                    <AdicionarUtilizador />
                </Col>
            </Row>

            {/* Aqui podes adicionar outros componentes, como uma lista de utilizadores, etc. */}
        </Container>
    );
};

export default DashboardAdmin;