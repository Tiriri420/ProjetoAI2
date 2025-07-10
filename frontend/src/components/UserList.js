// POSIÇÃO DO CÓDIGO: frontend/src/components/UserList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        setLoading(true); setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
            setUsers(res.data);
        } catch (err) {
            setError('Não foi possível carregar os utilizadores.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Tem a certeza que quer apagar este utilizador? Esta ação é irreversível e apagará todos os perfis e propostas associados (se for uma empresa).')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchUsers(); // Recarrega a lista após apagar
            } catch (err) {
                alert(err.response?.data?.message || 'Erro ao apagar o utilizador.');
            }
        }
    };

    const getRoleBadge = (role) => {
        const roleColors = {
            ADMIN: 'danger',
            GESTOR: 'info',
            EMPRESA: 'success',
            ESTUDANTE: 'primary'
        };
        return <Badge bg={roleColors[role] || 'secondary'}>{role}</Badge>;
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-PT');

    if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Registado em</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id_utilizador}>
                        <td>{user.id_utilizador}</td>
                        <td>{user.nome}</td>
                        <td>{user.email}</td>
                        <td>{getRoleBadge(user.role)}</td>
                        <td>{formatDate(user.created_at)}</td>
                        <td>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user.id_utilizador)}>
                                Apagar
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default UserList;