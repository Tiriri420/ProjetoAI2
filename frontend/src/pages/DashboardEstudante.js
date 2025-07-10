// POSIÇÃO DO CÓDIGO: frontend/src/pages/DashboardEstudante.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import PerfilEstudanteForm from '../components/PerfilEstudanteForm';

const DashboardEstudante = () => {
    const [propostas, setPropostas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [appliedProposalIds, setAppliedProposalIds] = useState(new Set());

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                const [propostasRes, profileRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/propostas', config),
                    axios.get('http://localhost:5000/api/estudantes/me', config)
                ]);

                setPropostas(propostasRes.data);
                const appliedIds = profileRes.data.propostasCandidatadas.map(c => c.id_proposta); // <-- MUDANÇA AQUI
                setAppliedProposalIds(new Set(appliedIds));

            } catch (err) {
                setError('Não foi possível carregar as propostas disponíveis.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const handleApply = async (propostaId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/estudantes/candidaturas/${propostaId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppliedProposalIds(prevIds => new Set(prevIds).add(propostaId));
        } catch (err) {
            alert(err.response?.data?.message || "Ocorreu um erro ao candidatar-se.");
        }
    };
    
    const handleLogout = () => { /* ... */ };
    const formatDate = (dateString) => { /* ... */ };

    return (
        <Container fluid className="mt-4">
            <Row className="align-items-center mb-4">
                <Col><h1>Oportunidades Disponíveis</h1></Col>
                <Col md="auto"><Button variant="outline-primary" onClick={() => setShowProfileModal(true)}>O Meu Perfil</Button></Col>
                <Col md="auto"><Button variant="danger" onClick={handleLogout}>Logout</Button></Col>
            </Row>

            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} size="lg">
                <Modal.Body><PerfilEstudanteForm onFormSubmit={() => setShowProfileModal(false)} /></Modal.Body>
            </Modal>

            {loading && <div className="text-center"><Spinner animation="border" /></div>}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && (
                <Row>
                    {propostas.length > 0 ? propostas.map(p => (
                        <Col md={6} lg={4} key={p.id_proposta} className="mb-4">
                            <Card className="h-100">
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{p.titulo}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{p.empresa.nome_empresa}</Card.Subtitle>
                                    <Card.Text><strong>Local:</strong> {p.local_de_trabalho || 'N/A'}</Card.Text>
                                    <Card.Text><strong>Prazo:</strong> {formatDate(p.prazo_candidatura)}</Card.Text>
                                    <div className="mb-3">
                                        {p.competencias.map(c => (
                                            <Badge pill bg="info" key={c.nome} className="me-1 fw-normal">{c.nome}</Badge>
                                        ))}
                                    </div>
                                    <div className="mt-auto">
                                        <Button 
                                            variant={appliedProposalIds.has(p.id_proposta) ? "success" : "primary"}
                                            className="w-100"
                                            onClick={() => handleApply(p.id_proposta)}
                                            disabled={appliedProposalIds.has(p.id_proposta)}
                                        >
                                            {appliedProposalIds.has(p.id_proposta) ? "Candidatura Enviada" : "Candidatar-me"}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    )) : <p className="text-center text-muted">De momento, não existem propostas disponíveis.</p>}
                </Row>
            )}
        </Container>
    );
};

export default DashboardEstudante;