import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge, Modal, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import PropostaForm from '../components/PropostaForm';

const CandidatesModal = ({ proposal, show, handleClose }) => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchCandidates = async () => {
        if (proposal) {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/propostas/${proposal.id_proposta}/candidatos`, { headers: { Authorization: `Bearer ${token}` } });
                setCandidates(res.data);
            } catch (err) { console.error("Erro ao buscar candidatos", err); } finally { setLoading(false); }
        }
    };
    useEffect(() => { if (show) { fetchCandidates(); } }, [show, proposal]);
    const handleDecision = async (estudanteId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/empresas/candidaturas/${proposal.id_proposta}/${estudanteId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            setCandidates(prev => prev.map(c => c.Utilizador.id_utilizador === estudanteId ? { ...c, Candidatura: { ...c.Candidatura, status: status } } : c));
        } catch (err) { alert('Erro ao processar a decisão.'); }
    };
    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton><Modal.Title>Candidatos para: {proposal?.titulo}</Modal.Title></Modal.Header>
            <Modal.Body>
                {loading ? <div className="text-center"><Spinner animation="border" /></div> : (
                    <ListGroup variant="flush">
                        {candidates.length > 0 ? candidates.map(c => (
                            <ListGroup.Item key={c.Utilizador.id_utilizador} className="d-flex justify-content-between align-items-center flex-wrap">
                                <div className="mb-2">
                                    <h5>{c.Utilizador.nome}</h5>
                                    <p className="mb-1 text-muted">{c.Utilizador.email}</p>
                                    <p className="mb-1"><strong>Curso:</strong> {c.curso || 'N/A'} ({c.ano_conclusao || 'N/A'})</p>
                                    <div>{c.habilidades.map(h => <Badge pill bg="dark" key={h.nome} className="me-1 fw-normal">{h.nome}</Badge>)}</div>
                                </div>
                                <div className="align-self-center">
                                    {c.Candidatura.status === 'PENDENTE' ? (
                                        <>
                                            <Button variant="success" size="sm" className="me-2" onClick={() => handleDecision(c.Utilizador.id_utilizador, 'ACEITE')}>Aceitar</Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDecision(c.Utilizador.id_utilizador, 'REJEITADO')}>Rejeitar</Button>
                                        </>
                                    ) : (<Badge bg={c.Candidatura.status === 'ACEITE' ? 'success' : 'danger'}>{c.Candidatura.status}</Badge>)}
                                </div>
                            </ListGroup.Item>
                        )) : <p className="text-center py-4">Ainda não existem candidatos para esta proposta.</p>}
                    </ListGroup>
                )}
            </Modal.Body>
        </Modal>
    );
};

const DashboardEmpresa = () => {
    const [minhasPropostas, setMinhasPropostas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [showCandidatesModal, setShowCandidatesModal] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [editingProposalId, setEditingProposalId] = useState(null);
    const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('userRole'); window.location.href = '/login'; };
    const fetchMinhasPropostas = async () => {
        setLoading(true); setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/propostas/minhas', { headers: { Authorization: `Bearer ${token}` } });
            setMinhasPropostas(res.data);
        } catch (err) { setError('Não foi possível carregar as suas propostas.'); } finally { setLoading(false); }
    };
    useEffect(() => { fetchMinhasPropostas(); }, []);
    const getStatusBadge = (status) => {
        const map = { PENDENTE: 'warning', VALIDADO: 'success', FECHADO: 'secondary', REJEITADO: 'danger' };
        return <Badge bg={map[status] || 'dark'}>{status}</Badge>;
    };
    const formatDate = (dateString) => { if (!dateString) return 'N/A'; return new Date(dateString).toLocaleDateString('pt-PT'); };
    const handleDeactivate = async (id) => {
        if (window.confirm("Tem a certeza?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.patch(`http://localhost:5000/api/propostas/${id}/deactivate`, {}, { headers: { Authorization: `Bearer ${token}` } });
                fetchMinhasPropostas();
            } catch (err) { alert("Ocorreu um erro."); }
        }
    };
    const handleShowCreateModal = () => { setEditingProposalId(null); setShowFormModal(true); };
    const handleShowEditModal = (id) => { setEditingProposalId(id); setShowFormModal(true); };
    const handleFormSubmit = () => { setShowFormModal(false); fetchMinhasPropostas(); };
    const handleShowCandidates = (proposal) => { setSelectedProposal(proposal); setShowCandidatesModal(true); };

    return (
        <Container fluid className="py-4 px-md-4">
            <Row className="align-items-center mb-4">
                <Col><h1>Painel da Empresa</h1></Col>
                <Col className="text-end"><Button variant="danger" onClick={handleLogout}>Logout</Button></Col>
            </Row>
            <Modal show={showFormModal} onHide={() => setShowFormModal(false)} size="lg"><Modal.Body><PropostaForm proposalId={editingProposalId} onFormSubmit={handleFormSubmit} /></Modal.Body></Modal>
            {selectedProposal && <CandidatesModal proposal={selectedProposal} show={showCandidatesModal} handleClose={() => setShowCandidatesModal(false)} />}
            <Card>
                <Card.Header as="h5" className="d-flex justify-content-between align-items-center">As Minhas Propostas<Button variant="primary" onClick={handleShowCreateModal}>+ Criar Nova Proposta</Button></Card.Header>
                <Card.Body className="p-0">
                    {loading && <div className="text-center py-5"><Spinner animation="border" /></div>}
                    {error && <Alert variant="danger" className="m-3">{error}</Alert>}
                    {!loading && !error && (
                        <ListGroup variant="flush">
                            {minhasPropostas.length > 0 ? minhasPropostas.map(p => (
                                <ListGroup.Item key={p.id_proposta} className="px-3 py-3">
                                    <Row className="align-items-center">
                                        <Col xs={12} md={6} className="mb-2 mb-md-0">
                                            <h5 className="mb-1">{p.titulo}</h5>
                                            <p className="mb-1"><small className="text-muted">{p.local_de_trabalho || 'N/A'} | Prazo: {formatDate(p.prazo_candidatura)}</small></p>
                                            <div>{getStatusBadge(p.status)}</div>
                                        </Col>
                                        <Col xs={12} md={6} className="text-md-end">
                                            <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleShowCandidates(p)}>Ver Candidatos</Button>
                                            <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShowEditModal(p.id_proposta)} disabled={p.status === 'FECHADO'}>Editar</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDeactivate(p.id_proposta)} disabled={p.status === 'FECHADO'}>Desativar</Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )) : <p className="text-center text-muted p-4">Ainda não criou nenhuma proposta.</p>}
                        </ListGroup>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};
export default DashboardEmpresa;