import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';

const DashboardEstudante = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    };

    // Dados de exemplo
    const propostasRecomendadas = [
        { id: 1, title: 'Developer Júnior (React)', company: 'Innovatech' },
        { id: 7, title: 'Estágio Curricular - Frontend', company: 'DevHouse' },
    ];

    return (
        <Container fluid className="mt-4">
            <Row className="align-items-center mb-4">
                <Col><h1>Oportunidades para Si</h1></Col>
                <Col className="text-end"><Button variant="danger" onClick={handleLogout}>Logout</Button></Col>
            </Row>

            <Row>
                <Col md={8}>
                    <Card>
                        <Card.Header as="h5">Propostas Recomendadas</Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                {propostasRecomendadas.map(p => (
                                    <ListGroup.Item key={p.id} action onClick={() => alert(`Ver detalhes da proposta ${p.id}`)}>
                                        <strong>{p.title}</strong> - {p.company}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card>
                        <Card.Header as="h5">O seu Perfil</Card.Header>
                        <Card.Body>
                            <p>Mantenha o seu perfil atualizado para receber as melhores sugestões!</p>
                            <Button variant="primary" className="w-100 mb-2">Editar o meu Perfil</Button>
                            <Button variant="outline-secondary" className="w-100">Ver todas as Propostas</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardEstudante;