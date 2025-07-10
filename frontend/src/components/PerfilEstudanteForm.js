// POSIÇÃO DO CÓDIGO: frontend/src/components/PerfilEstudanteForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Card, Row, Col, Spinner, Badge } from 'react-bootstrap';

const PerfilEstudanteForm = ({ onFormSubmit }) => {
    const [profileData, setProfileData] = useState({
        curso: '',
        ano_conclusao: '',
        competencias: [],
        areasInteresse: [],
    });
    const [allCompetencias, setAllCompetencias] = useState([]);
    const [allAreas, setAllAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            try {
                const [profileRes, competenciasRes, areasRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/estudantes/me', config),
                    axios.get('http://localhost:5000/api/competencias', config),
                    axios.get('http://localhost:5000/api/areas', config)
                ]);

                const { curso, ano_conclusao, competencias, areasInteresse } = profileRes.data;
                setProfileData({
                    curso: curso || '',
                    ano_conclusao: ano_conclusao || '',
                    competencias: competencias.map(c => c.id_competencia),
                    areasInteresse: areasInteresse.map(a => a.id_area),
                });
                
                setAllCompetencias(competenciasRes.data);
                setAllAreas(areasRes.data);

            } catch (err) {
                setError("Não foi possível carregar os dados do perfil.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const onChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e, field) => {
        const { value, checked } = e.target;
        const id = parseInt(value);
        let updatedValues = checked
            ? [...profileData[field], id]
            : profileData[field].filter(v => v !== id);
        setProfileData({ ...profileData, [field]: updatedValues });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:5000/api/estudantes/me', profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Perfil atualizado com sucesso!');
            setTimeout(() => { if(onFormSubmit) onFormSubmit(); }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Ocorreu um erro.');
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) return <div className="text-center"><Spinner animation="border" /></div>;

    return (
        <Card border="0">
            <Card.Header as="h5">O Meu Perfil</Card.Header>
            <Card.Body>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={onSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Curso</Form.Label>
                                <Form.Control type="text" name="curso" value={profileData.curso} onChange={onChange} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Ano de Conclusão</Form.Label>
                                <Form.Control type="number" name="ano_conclusao" value={profileData.ano_conclusao} onChange={onChange} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>As Minhas Competências</Form.Label>
                        <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
                            {allCompetencias.map(c => (
                                <Form.Check key={c.id_competencia} type="checkbox" label={c.nome} value={c.id_competencia}
                                    checked={profileData.competencias.includes(c.id_competencia)}
                                    onChange={(e) => handleCheckboxChange(e, 'competencias')}
                                />
                            ))}
                        </div>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Áreas de Interesse</Form.Label>
                        <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
                            {allAreas.map(a => (
                                <Form.Check key={a.id_area} type="checkbox" label={a.nome} value={a.id_area}
                                    checked={profileData.areasInteresse.includes(a.id_area)}
                                    onChange={(e) => handleCheckboxChange(e, 'areasInteresse')}
                                />
                            ))}
                        </div>
                    </Form.Group>
                    
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'A guardar...' : 'Guardar Alterações'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default PerfilEstudanteForm;