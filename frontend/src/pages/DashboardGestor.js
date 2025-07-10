// POSIÇÃO DO CÓDIGO: frontend/src/pages/DashboardGestor.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const DashboardGestor = () => {
    const [pendingProposals, setPendingProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    };

    const fetchPendingProposals = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/propostas/pendentes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingProposals(res.data);
        } catch (err) {
            console.error("Erro ao buscar propostas pendentes", err);
            setError('Não foi possível carregar as propostas. Tente atualizar a página.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingProposals();
    }, []);

    const handleValidate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/propostas/${id}/validate`, 
                { newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPendingProposals(pendingProposals.filter(p => p.id_proposta !== id));
        } catch (err) {
            alert(`Ocorreu um erro ao tentar ${newStatus === 'VALIDADO' ? 'aprovar' : 'rejeitar'} a proposta.`);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-PT', options);
    };

    return (
        <Container fluid className="mt-4">
            <Row className="align-items-center mb-4">
                <Col><h1>Dashboard do Gestor</h1></Col>
                <Col className="text-end"><Button variant="danger" onClick={handleLogout}>Logout</Button></Col>
            </Row>

            <Card>
                <Card.Header as="h5">Propostas Pendentes de Validação</Card.Header>
                <Card.Body>
                    {loading && <div className="text-center"><Spinner animation="border" /></div>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {!loading && !error && (
                        <ListGroup variant="flush">
                            {pendingProposals.length > 0 ? pendingProposals.map(p => (
                                <ListGroup.Item key={p.id_proposta}>
                                    <Row className="align-items-center">
                                        <Col md={8}>
                                            <h5 className="mb-1">{p.titulo}</h5>
                                            <p className="mb-1"><strong>Empresa:</strong> {p.empresa.nome_empresa}</p>
                                            
                                            <div className="d-flex text-muted mb-2">
                                                <p className="mb-0 me-4"><strong>Local:</strong> {p.local_de_trabalho || 'Não especificado'}</p>
                                                <p className="mb-0"><strong>Prazo:</strong> {formatDate(p.prazo_candidatura)}</p>
                                            </div>
                                            
                                            <p className="mb-2">{p.descricao}</p>
                                            
                                            <div>
                                                {p.competencias.map(c => (
                                                    <Badge pill bg="info" key={c.nome} className="me-1 fw-normal">
                                                        {c.nome}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </Col>
                                        <Col md={4} className="text-end">
                                            <Button 
                                                variant="success" 
                                                className="me-2 mb-1" 
                                                onClick={() => handleValidate(p.id_proposta, 'VALIDADO')}
                                            >
                                                Aprovar
                                            </Button>
                                            <Button 
                                                variant="danger"
                                                className="mb-1"
                                                onClick={() => handleValidate(p.id_proposta, 'REJEITADO')}
                                            >
                                                Rejeitar
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )) : <p className="text-center text-muted">Não existem propostas pendentes de validação.</p>}
                        </ListGroup>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default DashboardGestor;