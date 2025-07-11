import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, Spinner, Alert, ListGroup } from 'react-bootstrap';
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
        <Row xs={1} md={2} lg={4} className="g-4">
            <Col><Card className="text-center"><Card.Body><Card.Title className="h2">{stats.totalUsers || 0}</Card.Title><Card.Text className="text-muted">Utilizadores</Card.Text></Card.Body></Card></Col>
            <Col><Card className="text-center"><Card.Body><Card.Title className="h2">{stats.totalEmpresas || 0}</Card.Title><Card.Text className="text-muted">Empresas</Card.Text></Card.Body></Card></Col>
            <Col><Card className="text-center"><Card.Body><Card.Title className="h2">{stats.totalPropostas || 0}</Card.Title><Card.Text className="text-muted">Propostas Totais</Card.Text></Card.Body></Card></Col>
            <Col><Card className="text-center"><Card.Body><Card.Title className="h2">{stats.pendingPropostas || 0}</Card.Title><Card.Text className="text-muted">Propostas Pendentes</Card.Text></Card.Body></Card></Col>
        </Row>
    );
};

const AdminProposalsPanel = () => {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchPending = async () => {
            setLoading(true); setError('');
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/propostas/pendentes', { headers: { Authorization: `Bearer ${token}` } });
                setProposals(res.data);
            } catch (err) { setError('Não foi possível carregar as propostas.'); } finally { setLoading(false); }
        };
        fetchPending();
    }, []);
    const handleValidate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/propostas/${id}/validate`, { newStatus }, { headers: { Authorization: `Bearer ${token}` } });
            setProposals(prev => prev.filter(p => p.id_proposta !== id));
        } catch (err) { alert('Erro ao validar proposta.'); }
    };
    if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;
    return (
        <Card>
            <Card.Header as="h5">Propostas Pendentes de Validação</Card.Header>
            <ListGroup variant="flush">
                {proposals.length > 0 ? proposals.map(p => (
                    <ListGroup.Item key={p.id_proposta} className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{p.titulo}</strong><br />
                            <small className="text-muted">{p.empresa.nome_empresa}</small>
                        </div>
                        <div>
                            <Button variant="success" size="sm" className="me-2" onClick={() => handleValidate(p.id_proposta, 'VALIDADO')}>Aprovar</Button>
                            <Button variant="danger" size="sm" onClick={() => handleValidate(p.id_proposta, 'REJEITADO')}>Rejeitar</Button>
                        </div>
                    </ListGroup.Item>
                )) : <ListGroup.Item className="text-center text-muted py-4">Não existem propostas pendentes.</ListGroup.Item>}
            </ListGroup>
        </Card>
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
        <Container fluid className="py-4 px-md-4">
            <Row className="align-items-center mb-4">
                <Col><h1>Painel de Administrador</h1></Col>
                <Col className="text-end"><Button variant="danger" onClick={handleLogout}>Logout</Button></Col>
            </Row>
            
            <div className="mb-4">
                <StatsPanel />
            </div>

            <Tabs defaultActiveKey="users" id="admin-dashboard-tabs" className="mb-3">
                <Tab eventKey="users" title="Gestão de Utilizadores" className="py-3">
                    <Row className="g-4">
                        <Col lg={5}>
                            <Card className="h-100"><AdicionarUtilizador /></Card>
                        </Col>
                        <Col lg={7}>
                            <Card className="h-100">
                                <Card.Header as="h5">Utilizadores Registados</Card.Header>
                                <Card.Body className="p-0"><UserList /></Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="validation" title="Validação de Propostas" className="py-3">
                    <AdminProposalsPanel />
                </Tab>
                <Tab eventKey="competencias" title="Gestão de Competências" className="py-3">
                    <ManageEntity entityName="Competências" apiEndpoint="competencias" fields={competenciaFields} />
                </Tab>
                <Tab eventKey="areas" title="Gestão de Áreas/Departamentos" className="py-3">
                    <ManageEntity entityName="Áreas" apiEndpoint="areas" fields={areaFields} />
                </Tab>
            </Tabs>
        </Container>
    );
};
export default DashboardAdmin;