// POSIÇÃO DO CÓDIGO: frontend/src/components/ManageEntity.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal, Row, Col } from 'react-bootstrap';

const ManageEntity = ({ entityName, apiEndpoint, fields }) => {
    const [items, setItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentItem, setCurrentItem] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/${apiEndpoint}`, { headers: { Authorization: `Bearer ${token}` } });
        setItems(res.data);
    };

    useEffect(() => { fetchData(); }, [apiEndpoint]);

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const data = { ...currentItem };
        delete data[fields[0].name]; // Remove ID do corpo do pedido

        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/admin/${apiEndpoint}/${currentItem[fields[0].name]}`, data, config);
            } else {
                await axios.post(`http://localhost:5000/api/admin/${apiEndpoint}`, data, config);
            }
            fetchData();
            setShowModal(false);
        } catch (error) {
            alert('Erro ao guardar.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem a certeza?')) {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/admin/${apiEndpoint}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        }
    };

    const openModal = (item = null) => {
        if (item) {
            setCurrentItem({ ...item });
            setIsEditing(true);
        } else {
            const initialItem = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
            setCurrentItem(initialItem);
            setIsEditing(false);
        }
        setShowModal(true);
    };

    return (
        <>
            <Button onClick={() => openModal()} className="mb-3">Adicionar Novo</Button>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        {fields.map(f => <th key={f.name}>{f.label}</th>)}
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item[fields[0].name]}>
                            {fields.map(f => <td key={f.name}>{item[f.name]}</td>)}
                            <td>
                                <Button variant="outline-primary" size="sm" onClick={() => openModal(item)}>Editar</Button>{' '}
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item[fields[0].name])}>Apagar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><Modal.Title>{isEditing ? 'Editar' : 'Adicionar'}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        {fields.slice(1).map(field => ( // slice(1) para não mostrar o campo ID
                            <Form.Group as={Row} className="mb-3" key={field.name}>
                                <Form.Label column sm="3">{field.label}</Form.Label>
                                <Col sm="9">
                                {field.type === 'select' ? (
                                    <Form.Select value={currentItem[field.name] || ''} onChange={e => setCurrentItem({...currentItem, [field.name]: e.target.value})}>
                                        {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </Form.Select>
                                ) : (
                                    <Form.Control type={field.type || 'text'} value={currentItem[field.name] || ''} onChange={e => setCurrentItem({...currentItem, [field.name]: e.target.value})}/>
                                )}
                                </Col>
                            </Form.Group>
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Fechar</Button>
                    <Button variant="primary" onClick={handleSave}>Guardar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ManageEntity;