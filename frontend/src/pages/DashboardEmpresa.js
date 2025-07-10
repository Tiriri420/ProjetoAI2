// POSIÇÃO DO CÓDIGO: frontend/src/pages/DashboardEmpresa.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge, Modal, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import PropostaForm from '../components/PropostaForm';

const DashboardEmpresa = () => {
    const [minhasPropostas, setMinhasPropostas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProposalId, setEditingProposalId] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    };

    const fetchMinhasPropostas = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/propostas/minhas', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMinhasPropostas(res.data);
        } catch (err) {
            setError('Não foi possível carregar as suas propostas. Tente atualizar a página.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMinhasPropostas();
    }, []);

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDENTE: { bg: 'warning', text: 'Pendente' },
            VALIDADO: { bg: 'success', text: 'Validado' },
            FECHADO: { bg: 'secondary', text: 'Fechado' },
            REJEITADO: { bg: 'danger', text: 'Rejeitado' },
        };
        const { bg, text } = statusMap[status] || { bg: 'dark', text: status };
        return <Badge bg={bg}>{text}</Badge>;
    };

    const handleDeactivate = async (id) => {
        if (window.confirm("Tem a certeza que quer desativar esta proposta? Esta ação não pode ser revertida pela empresa.")) {
            try {
                const token = localStorage.getItem('token');
                await axios.patch(`http://localhost:5000/api/propostas/${id}/deactivate`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchMinhasPropostas();
            } catch (err) {
                alert("Ocorreu um erro ao desativar a proposta.");
            }
        }
    };
    
    const handleShowCreateModal = () => {
        setEditingProposalId(null);
        setShowModal(true);
    };

    const handleShowEditModal = (id) => {
        setEditingProposalId(id);
        setShowModal(true);
    };

    const handleFormSubmit = () => {
        setShowModal(false);
        fetchMinhasPropostas();
    };

    return (
        <Container fluid className="mt-4">
            <Row className="align-items-center mb-4">
                <Col><h1>Dashboard da Empresa</h1></Col>
                <Col className="text-end"><Button variant="danger" onClick={handleLogout}>Logout</Button></Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Body>
                    <PropostaForm proposalId={editingProposalId} onFormSubmit={handleFormSubmit} />
                </Modal.Body>
            </Modal>

            <Card>
                <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
                    As Minhas Propostas
                    <Button variant="primary" onClick={handleShowCreateModal}>
                        + Criar Nova Proposta
                    </Button>
                </Card.Header>
                <Card.Body>
                    {loading && <div className="text-center"><Spinner animation="border" /></div>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {!loading && !error && (
                        <ListGroup variant="flush">
                            {minhasPropostas.length > 0 ? minhasPropostas.map(p => (
                                <ListGroup.Item key={p.id_proposta} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-1">{p.titulo} {getStatusBadge(p.status)}</h5>
                                        <p className="mb-1 text-muted">{p.local_de_trabalho}</p>
                                        <div>
                                            {p.competencias.map(c => (
                                                <Badge pill bg="info" key={c.id_competencia} className="me-1 fw-normal">
                                                    {c.nome}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShowEditModal(p.id_proposta)}>
                                            Editar
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDeactivate(p.id_proposta)} disabled={p.status === 'FECHADO'}>
                                            Desativar
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            )) : <p className="text-center text-muted">Ainda não criou nenhuma proposta.</p>}
                        </ListGroup>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default DashboardEmpresa;