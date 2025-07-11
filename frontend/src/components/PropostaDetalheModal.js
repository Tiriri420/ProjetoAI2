import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

const PropostaDetalheModal = ({ proposalId, show, handleClose }) => {
    const [proposta, setProposta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (proposalId) {
            setLoading(true);
            setError('');
            const fetchDetails = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const res = await axios.get(`http://localhost:5000/api/propostas/view/${proposalId}`, config);
                    setProposta(res.data);
                } catch (err) {
                    setError("Não foi possível carregar os detalhes desta proposta.");
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        }
    }, [proposalId]);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{proposta?.titulo || "A Carregar..."}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && <div className="text-center"><Spinner animation="border" /></div>}
                {error && <Alert variant="danger">{error}</Alert>}
                {!loading && proposta && (
                    <>
                        <h4>{proposta.empresa.nome_empresa}</h4>
                        <p className="text-muted">{proposta.empresa.localizacao}</p>
                        <hr />
                        <p><strong>Tipo de Contrato:</strong> {proposta.tipo_proposta}</p>
                        <p><strong>Local de Trabalho:</strong> {proposta.local_de_trabalho}</p>
                        <p><strong>Prazo para Candidatura:</strong> {formatDate(proposta.prazo_candidatura)}</p>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{proposta.descricao}</p>
                        <hr />
                        <h6>Competências Necessárias:</h6>
                        <div>
                            {proposta.competencias.map(c => <Badge pill bg="primary" key={c.nome} className="me-1 fw-normal">{c.nome}</Badge>)}
                        </div>
                        <h6 className="mt-3">Áreas Relevantes:</h6>
                        <div>
                            {proposta.areas.map(a => <Badge pill bg="secondary" key={a.nome} className="me-1 fw-normal">{a.nome}</Badge>)}
                        </div>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Fechar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PropostaDetalheModal;