import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert, Card, Row, Col } from 'react-bootstrap';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', response.data.role);
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Ocorreu um erro. Tente novamente.');
        }
    };

    return (
        <div className="login-page-wrapper">
            <Container>
                <Row className="align-items-center justify-content-center">
                    <Col md={6} className="info-panel text-white mb-5 mb-md-0">
                        <h1 className="display-4">Plataforma ESTGV</h1>
                        <p className="lead">Conectando o talento da ESTGV com as melhores oportunidades de mercado.</p>
                        <ul className="list-unstyled mt-4">
                            <li className="mb-2">✓ Para Empresas: Encontrem os melhores candidatos.</li>
                            <li className="mb-2">✓ Para Alunos: Descubram a vossa próxima oportunidade.</li>
                            <li className="mb-2">✓ Simples, rápido e direto ao ponto.</li>
                        </ul>
                    </Col>
                    <Col md={5}>
                        <Card className="login-card">
                            <Card.Body>
                                <h3 className="text-center mb-4">Login</h3>
                                <Form onSubmit={handleSubmit}>
                                    {error && <Alert variant="danger">{error}</Alert>}
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="O seu email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="A sua password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <div className="d-grid">
                                        <Button variant="primary" type="submit" size="lg">
                                            Entrar
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LoginPage;