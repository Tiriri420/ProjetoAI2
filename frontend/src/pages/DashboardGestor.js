import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';

const DashboardGestor = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    };

    // Dados de exemplo (propostas do seu departamento)
    const propostasParaValidar = [
        { id: 4, title: 'Técnico de Redes', company: 'InfraCo' },
        { id: 5, title: 'Estágio em Cibersegurança', company: 'SecureNet' },
    ];

    return (
        <Container fluid className="mt-4">
            <Row className="align-items-center mb-4">
                <Col><h1>Dashboard do Gestor de Departamento</h1></Col>
                <Col className="text-end"><Button variant="danger" onClick={handleLogout}>Logout</Button></Col>
            </Row>
            
            <Row>
                <Col>
                    <Card>
                        <Card.Header as="h5">Propostas do seu Departamento para Validar</Card.Header>
                        <Card.Body>
                            {propostasParaValidar.length > 0 ? (
                                <ListGroup variant="flush">
                                    {propostasParaValidar.map(p => (
                                        <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-center">
                                            {p.title} - <strong>{p.company}</strong>
                                            <div>
                                                <Button variant="success" size="sm" className="me-2">Aprovar</Button>
                                                <Button variant="danger" size="sm">Rejeitar</Button>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p>Nenhuma proposta a aguardar validação no seu departamento.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardGestor;