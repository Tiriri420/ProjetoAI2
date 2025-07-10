// POSIÇÃO DO CÓDIGO: frontend/src/components/AdicionarUtilizador.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';

const AdicionarUtilizador = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        password: '',
        role: 'ESTUDANTE',
        // Campos condicionais
        nome_empresa: '',
        departamento_id: '',
        curso: '',
        ano_conclusao: '',
    });
    const [areas, setAreas] = useState([]); // Para o dropdown de departamentos
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (formData.role === 'GESTOR') {
            const fetchAreas = async () => {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                try {
                    const res = await axios.get('http://localhost:5000/api/areas', config);
                    setAreas(res.data);
                } catch (err) {
                    setError('Não foi possível carregar os departamentos.');
                }
            };
            fetchAreas();
        }
    }, [formData.role]);

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        const token = localStorage.getItem('token');
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
        try {
            const response = await axios.post('http://localhost:5000/api/users/create', formData, config);
            setMessage(response.data.message);
            setFormData({ nome: '', email: '', password: '', role: 'ESTUDANTE', nome_empresa: '', departamento_id: '', curso: '', ano_conclusao: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao criar utilizador.');
        }
    };

    return (
        <Card>
            <Card.Header>Adicionar Novo Utilizador</Card.Header>
            <Card.Body>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={onSubmit}>
                    <Row>
                        <Col md={6}><Form.Group className="mb-3">
                            <Form.Label>Nome Completo</Form.Label>
                            <Form.Control type="text" name="nome" value={formData.nome} onChange={onChange} required />
                        </Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={formData.email} onChange={onChange} required />
                        </Form.Group></Col>
                    </Row>
                    <Row>
                        <Col md={6}><Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" value={formData.password} onChange={onChange} required />
                        </Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3">
                            <Form.Label>Tipo de Utilizador (Role)</Form.Label>
                            <Form.Select name="role" value={formData.role} onChange={onChange}>
                                <option value="ESTUDANTE">Estudante</option>
                                <option value="EMPRESA">Empresa</option>
                                <option value="GESTOR">Gestor de Departamento</option>
                                <option value="ADMIN">Administrador</option>
                            </Form.Select>
                        </Form.Group></Col>
                    </Row>
                    
                    {formData.role === 'ESTUDANTE' && (
                        <Row>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label>Curso</Form.Label><Form.Control type="text" name="curso" value={formData.curso} onChange={onChange}/></Form.Group></Col>
                            <Col md={6}><Form.Group className="mb-3"><Form.Label>Ano de Conclusão</Form.Label><Form.Control type="number" name="ano_conclusao" value={formData.ano_conclusao} onChange={onChange}/></Form.Group></Col>
                        </Row>
                    )}

                    {formData.role === 'EMPRESA' && (
                        <Form.Group className="mb-3"><Form.Label>Nome da Empresa</Form.Label><Form.Control type="text" name="nome_empresa" value={formData.nome_empresa} onChange={onChange} required/></Form.Group>
                    )}

                    {formData.role === 'GESTOR' && (
                        <Form.Group className="mb-3"><Form.Label>Departamento</Form.Label>
                            <Form.Select name="departamento_id" value={formData.departamento_id} onChange={onChange} required>
                                <option value="">Selecione um departamento</option>
                                {areas.map(area => (<option key={area.id_area} value={area.id_area}>{area.nome}</option>))}
                            </Form.Select>
                        </Form.Group>
                    )}

                    <Button variant="primary" type="submit">Criar Utilizador</Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AdicionarUtilizador;