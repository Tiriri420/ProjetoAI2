const { Candidatura } = require('../models');

exports.decideOnCandidate = async (req, res) => {
    try {
        const { propostaId, estudanteId } = req.params;
        const { status } = req.body; // 'ACEITE' ou 'REJEITADO'

        if (!['ACEITE', 'REJEITADO'].includes(status)) {
            return res.status(400).json({ message: 'Status inválido.' });
        }

        const [updated] = await Candidatura.update(
            { status: status },
            { where: { proposta_id: propostaId, estudante_utilizador_id: estudanteId } }
        );

        if (updated) {
            res.status(200).json({ message: `Candidatura ${status.toLowerCase()}.` });
        } else {
            res.status(404).json({ message: 'Candidatura não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao processar a decisão.' });
    }
};