import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, Spinner, Alert, ListGroup, Badge, Accordion } from 'react-bootstrap';
import axios from 'axios';
import AdicionarUtilizador from '../components/AdicionarUtilizador';
import ManageEntity from '../components/ManageEntity';
import UserList from '../components/UserList';

const StatsPanel = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            if (!token) { setLoading(false); return; };
            try {
                const res = await axios.get('http://localhost:5000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } });
                setStats(res.data);
            } catch (err) { console.error("Erro ao buscar estatísticas", err); } finally { setLoading(false); }
        };
        fetchStats();
    }, []);
    if (loading) return <div className="text-center"><Spinner animation="border" size="sm" /></div>;
    return (
        <Row>
            <Col><Card className="text-center p-3"><Card.Title>{stats.totalUsers || 0}</Card.Title><Card.Text>Utilizadores</Card.Text></Card></Col>
            <Col><Card className="text-center p-3"><Card.Title>{stats.totalEmpresas || 0}</Card.Title><Card.Text>Empresas</Card.Text></Card></Col>
            <Col><Card className="text-center p-3"><Card.Title>{stats.totalPropostas || 0}</Card.Title><Card.Text>Propostas Totais</Card.Text></Card></Col>
            <Col><Card className="text-center p-3"><Card.Title>{stats.pendingPropostas || 0}</Card.Title><Card.Text>Propostas Pendentes</Card.Text></Card></Col>
        </Row>
    );
};

const AdminProposalsPanel = () => {
    const [pendingProposals, setPendingProposals] = useState([]);
    const [validatedProposals, setValidatedProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setLoading(true); setError('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const [pendingRes, validatedRes] = await Promise.all([
                axios.get('http://localhost:5000/api/propostas/pendentes', config),
                axios.get('http://localhost:5000/api/propostas/validadas', config)
            ]);
            setPendingProposals(pendingRes.data);
            setValidatedProposals(validatedRes.data);
        } catch (err) { setError('Não foi possível carregar as propostas.'); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleValidate = async (proposal, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/propostas/${proposal.id_proposta}/validate`, { newStatus }, { headers: { Authorization: `Bearer ${token}` } });
            setPendingProposals(prev => prev.filter(p => p.id_proposta !== proposal.id_proposta));
            setValidatedProposals(prev => [{ ...proposal, status: newStatus }, ...prev]);
        } catch (err) { alert('Erro ao validar proposta.'); }
    };
    
    if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Row>
            <Col lg={7}>
                <Card>
                    <Card.Header as="h5">Propostas Pendentes</Card.Header>
                    <ListGroup variant="flush">
                        {pendingProposals.length > 0 ? pendingProposals.map(p => (
                            <ListGroup.Item key={p.id_proposta} className="d-flex justify-content-between align-items-center">
                                <div><strong>{p.titulo}</strong><br /><small className="text-muted">{p.empresa.nome_empresa}</small></div>
                                <div>
                                    <Button variant="success" size="sm" className="me-2" onClick={() => handleValidate(p, 'VALIDADO')}>Aprovar</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleValidate(p, 'REJEITADO')}>Rejeitar</Button>
                                </div>
                            </ListGroup.Item>
                        )) : <ListGroup.Item className="text-center text-muted">Não existem propostas pendentes.</ListGroup.Item>}
                    </ListGroup>
                </Card>
            </Col>
            <Col lg={5}>
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Histórico de Validações</Accordion.Header>
                        <Accordion.Body>
                            <ListGroup variant="flush">
                                {validatedProposals.length > 0 ? validatedProposals.map(p => (
                                    <ListGroup.Item key={p.id_proposta} className="d-flex justify-content-between align-items-center">
                                        {p.titulo}
                                        <Badge bg={p.status === 'VALIDADO' ? 'success' : 'danger'}>{p.status}</Badge>
                                    </ListGroup.Item>
                                )) : <p className="text-center text-muted">Ainda não validou nenhuma proposta.</p>}
                            </ListGroup>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
        </Row>
    );
};

const DashboardAdmin = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    };
    const competenciaFields = [{ name: 'id_competencia', label: 'ID' }, { name: 'nome', label: 'Nome' }, { name: 'tipo', label: 'Tipo', type: 'select', options: ['TECNICA', 'SOFTSKILL'] }];
    const areaFields = [{ name: 'id_area', label: 'ID' }, { name: 'nome', label: 'Nome' }];

    return (
        <Container fluid className="mt-4">
            <Row className="align-items-center mb-4">
                <Col><h1>Dashboard do Administrador</h1></Col>
                <Col className="text-end"><Button variant="danger" onClick={handleLogout}>Logout</Button></Col>
            </Row>
            <Card className="mb-4">
                <Card.Header as="h5">Estatísticas Gerais</Card.Header>
                <Card.Body><StatsPanel /></Card.Body>
            </Card>
            <Tabs defaultActiveKey="users" id="admin-dashboard-tabs" className="mb-3" fill>
                <Tab eventKey="users" title="Gestão de Utilizadores">
                    <Row>
                        <Col lg={5} className="mb-3 mb-lg-0">
                            <Card className="h-100"><Card.Body><AdicionarUtilizador /></Card.Body></Card>
                        </Col>
                        <Col lg={7}>
                            <Card className="h-100"><Card.Header as="h5">Utilizadores Registados</Card.Header><Card.Body><UserList /></Card.Body></Card>
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="validation" title="Validação de Propostas">
                    <AdminProposalsPanel />
                </Tab>
                <Tab eventKey="competencias" title="Gestão de Competências">
                    <ManageEntity entityName="Competências" apiEndpoint="competencias" fields={competenciaFields} />
                </Tab>
                <Tab eventKey="areas" title="Gestão de Áreas/Departamentos">
                    <ManageEntity entityName="Áreas" apiEndpoint="areas" fields={areaFields} />
                </Tab>
            </Tabs>
        </Container>
    );
};
export default DashboardAdmin;