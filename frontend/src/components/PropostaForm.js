// POSIÇÃO DO CÓDIGO: frontend/src/components/PropostaForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Card, Row, Col, Spinner } from 'react-bootstrap';

const PropostaForm = ({ proposalId, onFormSubmit }) => {
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        tipo_proposta: 'EMPREGO',
        local_de_trabalho: '',
        prazo_candidatura: '',
        competencias: [],
    });
    const [allCompetencias, setAllCompetencias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAllCompetencias = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('http://localhost:5000/api/competencias', config);
                setAllCompetencias(res.data);
            } catch (err) {
                setError("Não foi possível carregar a lista de competências.");
            }
        };

        const fetchProposalData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`http://localhost:5000/api/propostas/${proposalId}`, config);
                
                const { titulo, descricao, tipo_proposta, local_de_trabalho, prazo_candidatura, competencias } = res.data;
                const competenciaIds = competencias.map(c => c.id_competencia);
                const formattedPrazo = prazo_candidatura ? new Date(prazo_candidatura).toISOString().split('T')[0] : '';
                
                setFormData({ titulo, descricao, tipo_proposta, local_de_trabalho, prazo_candidatura: formattedPrazo, competencias: competenciaIds });
            } catch (err) {
                setError("Não foi possível carregar os dados da proposta para edição.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllCompetencias();
        if (proposalId) {
            fetchProposalData();
        }
    }, [proposalId]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCompetenciaChange = (e) => {
        const { value, checked } = e.target;
        const competenciaId = parseInt(value);
        let updatedCompetencias = checked
            ? [...formData.competencias, competenciaId]
            : formData.competencias.filter(id => id !== competenciaId);
        setFormData({ ...formData, competencias: updatedCompetencias });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        try {
            if (proposalId) {
                await axios.put(`http://localhost:5000/api/propostas/${proposalId}`, formData, config);
                setMessage('Proposta atualizada com sucesso!');
            } else {
                await axios.post('http://localhost:5000/api/propostas', formData, config);
                setMessage('Proposta criada com sucesso!');
            }
            setTimeout(() => { onFormSubmit(); }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Ocorreu um erro.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && proposalId) {
        return <div className="text-center"><Spinner animation="border" /></div>;
    }

    return (
        <Card border="0">
            <Card.Header as="h5">{proposalId ? 'Editar Proposta' : 'Criar Nova Proposta'}</Card.Header>
            <Card.Body>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Título da Proposta</Form.Label>
                        <Form.Control type="text" name="titulo" value={formData.titulo} onChange={onChange} required />
                    </Form.Group>
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tipo de Proposta</Form.Label>
                                <Form.Select name="tipo_proposta" value={formData.tipo_proposta} onChange={onChange}>
                                    <option value="EMPREGO">Emprego</option>
                                    <option value="ESTAGIO">Estágio</option>
                                    <option value="PROJETO">Projeto</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Local de Trabalho</Form.Label>
                                <Form.Control type="text" name="local_de_trabalho" value={formData.local_de_trabalho} onChange={onChange} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Prazo para Candidaturas</Form.Label>
                                <Form.Control type="date" name="prazo_candidatura" value={formData.prazo_candidatura} onChange={onChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Descrição Detalhada</Form.Label>
                        <Form.Control as="textarea" rows={4} name="descricao" value={formData.descricao} onChange={onChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Competências Necessárias</Form.Label>
                        <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
                            {allCompetencias.length > 0 ? allCompetencias.map(c => (
                                <Form.Check
                                    key={c.id_competencia}
                                    type="checkbox"
                                    label={c.nome}
                                    value={c.id_competencia}
                                    onChange={handleCompetenciaChange}
                                    checked={formData.competencias.includes(c.id_competencia)}
                                />
                            )) : <p>A carregar competências...</p>}
                        </div>
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'A guardar...' : (proposalId ? 'Guardar Alterações' : 'Submeter Proposta')}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default PropostaForm;