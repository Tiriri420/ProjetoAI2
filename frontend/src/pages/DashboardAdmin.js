import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import AdicionarUtilizador from '../components/AdicionarUtilizador'; // Você já tem este!

const DashboardAdmin = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    };

    // Dados de exemplo (no futuro, virão da API)
    const pendingProposals = [
        { id: 1, title: 'Developer Full-Stack', company: 'Tech Solutions' },
        { id: 2, title: 'Estágio em Marketing Digital', company: 'Web Agency' },
    ];

    return (
        <Container fluid className="mt-4">
            <Row className="align-items-center mb-4">
                <Col><h1>Dashboard do Administrador</h1></Col>
                <Col className="text-end"><Button variant="danger" onClick={handleLogout}>Logout</Button></Col>
            </Row>

            <Row>
                {/* Coluna de Ações Rápidas */}
                <Col md={8}>
                    <Card>
                        <Card.Header as="h5">Propostas Pendentes de Validação</Card.Header>
                        <Card.Body>
                            {pendingProposals.length > 0 ? (
                                <ListGroup variant="flush">
                                    {pendingProposals.map(p => (
                                        <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-center">
                                            {p.title} - <strong>{p.company}</strong>
                                            <Button variant="outline-primary" size="sm" onClick={() => alert(`Validar proposta ${p.id}`)}>Validar</Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p>Nenhuma proposta a aguardar validação.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                
                {/* Coluna de Estatísticas */}
                <Col md={4}>
                    <Card>
                        <Card.Header as="h5">Estatísticas</Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Total de Utilizadores: <strong>150</strong></ListGroup.Item>
                            <ListGroup.Item>Total de Empresas: <strong>30</strong></ListGroup.Item>
                            <ListGroup.Item>Propostas Ativas: <strong>45</strong></ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>

            {/* Componente para adicionar utilizador */}
            <Row className="mt-4">
                <Col>
                    <AdicionarUtilizador />
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardAdmin;