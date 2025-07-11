import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const DashboardGestor = () => {
    const [pendingProposals, setPendingProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('userRole'); window.location.href = '/login'; };
    const fetchPendingProposals = async () => {
        setLoading(true); setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/propostas/pendentes', { headers: { Authorization: `Bearer ${token}` } });
            setPendingProposals(res.data);
        } catch (err) { setError('Não foi possível carregar as propostas.'); } finally { setLoading(false); }
    };
    useEffect(() => { fetchPendingProposals(); }, []);
    const handleValidate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/propostas/${id}/validate`, { newStatus }, { headers: { Authorization: `Bearer ${token}` } });
            setPendingProposals(prev => prev.filter(p => p.id_proposta !== id));
        } catch (err) { alert('Ocorreu um erro.'); }
    };
    const formatDate = (dateString) => { if (!dateString) return 'N/A'; const options = { year: 'numeric', month: 'long', day: 'numeric' }; return new Date(dateString).toLocaleDateString('pt-PT', options); };

    return (
        <Container fluid className="py-4 px-md-4">
            <Row className="align-items-center mb-4">
                <Col><h1>Painel do Gestor</h1></Col>
                <Col className="text-end"><Button variant="danger" onClick={handleLogout}>Logout</Button></Col>
            </Row>
            <Card>
                <Card.Header as="h5">Propostas Pendentes de Validação</Card.Header>
                <Card.Body className="p-0">
                    {loading && <div className="text-center py-5"><Spinner animation="border" /></div>}
                    {error && <Alert variant="danger" className="m-3">{error}</Alert>}
                    {!loading && !error && (
                        <ListGroup variant="flush">
                            {pendingProposals.length > 0 ? pendingProposals.map(p => (
                                <ListGroup.Item key={p.id_proposta} className="px-3 py-3">
                                    <Row className="align-items-center">
                                        <Col md={8}>
                                            <h5 className="mb-1">{p.titulo}</h5>
                                            <p className="mb-1"><strong>Empresa:</strong> {p.empresa.nome_empresa}</p>
                                            <div className="d-flex text-muted mb-2">
                                                <p className="mb-0 me-4"><strong>Local:</strong> {p.local_de_trabalho || 'N/A'}</p>
                                                <p className="mb-0"><strong>Prazo:</strong> {formatDate(p.prazo_candidatura)}</p>
                                            </div>
                                            <p className="mb-2" style={{fontSize: '0.9rem'}}>{p.descricao}</p>
                                            <div className="mb-2"><strong>Competências:</strong> {p.competencias.map(c => (<Badge pill bg="primary" key={c.nome} className="ms-1 fw-normal">{c.nome}</Badge>))}</div>
                                            <div><strong>Áreas:</strong> {p.areas.map(a => (<Badge pill bg="secondary" key={a.nome} className="ms-1 fw-normal">{a.nome}</Badge>))}</div>
                                        </Col>
                                        <Col md={4} className="text-md-end mt-3 mt-md-0">
                                            <Button variant="success" className="me-2 mb-1" onClick={() => handleValidate(p.id_proposta, 'VALIDADO')}>Aprovar</Button>
                                            <Button variant="danger" className="mb-1" onClick={() => handleValidate(p.id_proposta, 'REJEITADO')}>Rejeitar</Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )) : <p className="text-center text-muted p-4">Não existem propostas pendentes para o seu departamento.</p>}
                        </ListGroup>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};
export default DashboardGestor;