import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, Spinner } from 'react-bootstrap';
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
            if (!token) {
                setLoading(false);
                return;
            };
            try {
                const res = await axios.get('http://localhost:5000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } });
                setStats(res.data);
            } catch (err) {
                console.error("Erro ao buscar estatísticas", err);
            } finally {
                setLoading(false);
            }
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


const DashboardAdmin = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    };

    const competenciaFields = [
        { name: 'id_competencia', label: 'ID' },
        { name: 'nome', label: 'Nome' },
        { name: 'tipo', label: 'Tipo', type: 'select', options: ['TECNICA', 'SOFTSKILL'] }
    ];
    
    const areaFields = [
        { name: 'id_area', label: 'ID' },
        { name: 'nome', label: 'Nome' }
    ];

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
                        <Col lg={5}>
                            <Card>
                                <Card.Body>
                                    <AdicionarUtilizador />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={7}>
                            <Card>
                                <Card.Header as="h5">Utilizadores Registados</Card.Header>
                                <Card.Body>
                                    <UserList />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
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