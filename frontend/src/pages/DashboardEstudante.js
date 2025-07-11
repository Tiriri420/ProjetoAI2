import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import PerfilEstudanteForm from '../components/PerfilEstudanteForm';
import PropostaDetalheModal from '../components/PropostaDetalheModal';

const PropostaCard = ({ proposta, candidaturaStatus, handleApply, handleShowDetails }) => {
    return (
        <Col md={6} lg={4} className="mb-4">
            <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                    <Card.Title style={{ cursor: 'pointer', color: '#0d6efd' }} onClick={() => handleShowDetails(proposta.id_proposta)}>
                        {proposta.titulo}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{proposta.empresa.nome_empresa}</Card.Subtitle>
                    <div className="mt-auto">
                        <Button
                            variant={candidaturaStatus ? "success" : "primary"}
                            className="w-100"
                            onClick={() => handleApply(proposta.id_proposta)}
                            disabled={!!candidaturaStatus}
                        >
                            {candidaturaStatus ? "Candidatura Enviada" : "Candidatar-me"}
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

const DashboardEstudante = () => {
    const [recommendedPropostas, setRecommendedPropostas] = useState([]);
    const [allPropostas, setAllPropostas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedProposalId, setSelectedProposalId] = useState(null);
    const [candidaturasMap, setCandidaturasMap] = useState(new Map());

    const fetchAllData = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const [recomRes, allRes, profileRes] = await Promise.all([
                axios.get('http://localhost:5000/api/propostas/recomendadas', config),
                axios.get('http://localhost:5000/api/propostas', config),
                axios.get('http://localhost:5000/api/estudantes/me', config)
            ]);

            setRecommendedPropostas(recomRes.data);
            setAllPropostas(allRes.data);
            
            const appliedMap = new Map();
            if (profileRes.data.propostasCandidatadas) {
                profileRes.data.propostasCandidatadas.forEach(c => {
                    if (c.candidaturaInfo) {
                        appliedMap.set(c.id_proposta, c.candidaturaInfo.status);
                    }
                });
            }
            setCandidaturasMap(appliedMap);

        } catch (err) {
            console.error("ERRO DETALHADO AO CARREGAR DADOS:", err);
            setError('Não foi possível carregar as propostas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleApply = async (propostaId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/estudantes/candidaturas/${propostaId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setCandidaturasMap(prevMap => new Map(prevMap).set(propostaId, 'PENDENTE'));
        } catch (err) {
            alert(err.response?.data?.message || "Ocorreu um erro ao candidatar-se.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    };

    const handleShowDetails = (id) => {
        setSelectedProposalId(id);
        setShowDetailModal(true);
    };

    return (
        <Container fluid className="mt-4">
            <Row className="align-items-center mb-4">
                <Col><h1>Dashboard do Estudante</h1></Col>
                <Col md="auto"><Button variant="outline-primary" onClick={() => setShowProfileModal(true)}>O Meu Perfil</Button></Col>
                <Col md="auto"><Button variant="danger" onClick={handleLogout}>Logout</Button></Col>
            </Row>

            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} size="lg">
                <Modal.Body><PerfilEstudanteForm onFormSubmit={() => setShowProfileModal(false)} /></Modal.Body>
            </Modal>

            <PropostaDetalheModal 
                proposalId={selectedProposalId} 
                show={showDetailModal} 
                handleClose={() => setShowDetailModal(false)} 
            />

            {loading && <div className="text-center"><Spinner animation="border" /></div>}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && (
                <Tabs defaultActiveKey="recomendadas" id="propostas-tabs" className="mb-3">
                    <Tab eventKey="recomendadas" title="Recomendadas para Si">
                        <Row className="mt-3">
                            {recommendedPropostas.length > 0 ? recommendedPropostas.map(p => (
                                <PropostaCard key={p.id_proposta} proposta={p} candidaturaStatus={candidaturasMap.get(p.id_proposta)} handleApply={handleApply} handleShowDetails={handleShowDetails} />
                            )) : <p className="text-center text-muted">Não encontrámos recomendações para si. Atualize o seu perfil!</p>}
                        </Row>
                    </Tab>
                    <Tab eventKey="todas" title="Todas as Oportunidades">
                        <Row className="mt-3">
                            {allPropostas.length > 0 ? allPropostas.map(p => (
                                <PropostaCard key={p.id_proposta} proposta={p} candidaturaStatus={candidaturasMap.get(p.id_proposta)} handleApply={handleApply} handleShowDetails={handleShowDetails} />
                            )) : <p className="text-center text-muted">De momento, não existem propostas disponíveis.</p>}
                        </Row>
                    </Tab>
                </Tabs>
            )}
        </Container>
    );
};

export default DashboardEstudante;