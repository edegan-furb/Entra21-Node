const db = require('../firebaseConfig');

const saidaController = {
    createSaida: async (req, res) => {
        try {
            const saidaRef = db.collection('saidas').doc();
            await saidaRef.set(req.body);
            res.status(201).json({ id: saidaRef.id, ...req.body });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    getAllSaidas: async (req, res) => {
        try {
            const saidasSnapshot = await db.collection('saidas').get();
            const saidas = [];
            saidasSnapshot.forEach(doc => {
                saidas.push({ id: doc.id, ...doc.data() });
            });
            res.status(200).json(saidas);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    getSaidaById: async (req, res) => {
        try {
            const saidaRef = db.collection('saidas').doc(req.params.id);
            const doc = await saidaRef.get();
            if (!doc.exists) {
                res.status(404).send('saida não encontrada');
            } else {
                res.status(200).json({ id: doc.id, ...doc.data() });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    updateSaida: async (req, res) => {
        try {
            const saidaRef = db.collection('saidas').doc(req.params.id);
            await saidaRef.update(req.body);
            res.status(200).send('saida atualizada com sucesso');
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    deleteSaida: async (req, res) => {
        try {
            const saidaRef = db.collection('saidas').doc(req.params.id);
            await saidaRef.delete();
            res.status(200).send('saida deletada com sucesso');
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

module.exports = saidaController;