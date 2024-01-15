const db = require('../firebaseConfig');

const ProdutoController = {
    createProduto: async (req, res) => {
        try {
            const produtoRef = db.collection('produtos').doc();
            await produtoRef.set(req.body);
            res.status(201).json({ id: produtoRef.id, ...req.body });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    getAllProdutos: async (req, res) => {
        try {
            const produtosSnapshot = await db.collection('produtos').get();
            const produtos = [];
            produtosSnapshot.forEach(doc => {
                produtos.push({ id: doc.id, ...doc.data() });
            });
            res.status(200).json(produtos);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    getProdutoById: async (req, res) => {
        try {
            const produtoRef = db.collection('produtos').doc(req.params.id);
            const doc = await produtoRef.get();
            if (!doc.exists) {
                res.status(404).send('Produto não encontrado');
            } else {
                res.status(200).json({ id: doc.id, ...doc.data() });
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    updateProduto: async (req, res) => {
        try {
            const produtoRef = db.collection('produtos').doc(req.params.id);
            await produtoRef.update(req.body);
            res.status(200).send('Produto atualizado com sucesso');
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    deleteProduto: async (req, res) => {
        try {
            const produtoRef = db.collection('produtos').doc(req.params.id);
            await produtoRef.delete();
            res.status(200).send('Produto deletado com sucesso');
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

module.exports = ProdutoController;