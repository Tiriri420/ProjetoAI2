import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';

const AdicionarUtilizador = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        password: '',
        role: 'ESTUDANTE', // Role por defeito
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { nome, email, password, role } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const response = await axios.post(
                'http://localhost:5000/api/users/create',
                formData,
                config
            );
            setMessage(response.data.message);
            // Limpa o formulário
            setFormData({ nome: '', email: '', password: '', role: 'ESTUDANTE' });
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
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nome Completo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nome do utilizador"
                                    name="nome"
                                    value={nome}
                                    onChange={onChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="email@exemplo.com"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tipo de Utilizador (Role)</Form.Label>
                                <Form.Select name="role" value={role} onChange={onChange}>
                                    <option value="ESTUDANTE">Estudante</option>
                                    <option value="EMPRESA">Empresa</option>
                                    <option value="GESTOR">Gestor de Departamento</option>
                                    <option value="ADMIN">Administrador</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="primary" type="submit">
                        Criar Utilizador
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AdicionarUtilizador;