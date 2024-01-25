const db = require('../firebaseConfig');

const SaidaController = {
    createSaida: async (req, res) => {
        try {
            // Pega uma referência para a coleção 'produtos'
            const produtosRef = db.collection('produtos');

            // Busca o produto com o ID fornecido na requisição
            const produtoDocRef = produtosRef.doc(req.body.id_produto);

            // Verifica se o produto existe
            const produtoSnapshot = await produtoDocRef.get();
            if (!produtoSnapshot.exists) {
                return res.status(404).send({ message: "Produto não encontrado" });
            }

            // Pega uma referência para a coleção 'saidas'
            // Cria um novo documento saida na coleção 'saida'
            const saidaRef = db.collection('saidas').doc();
            // Define os dados do nova saida com as informações recebidas
            await saidaRef.set({
                id_produto: produtoDocRef,
                data: new Date(req.body.data),
                quantidade: req.body.quantidade
            });

            // Constrói o objeto de resposta com informações sobre a saida criada
            const response = {
                mensagem: "Saida inserida com sucesso",
                produtoCriado: {
                    id_saida: saidaRef.id,
                    data: req.body.data,
                    quantidade: req.body.quantidade,
                    id_produto: req.body.id_produto,
                    request: {
                        tipo: "GET",
                        descrição: "Obter saida por ID",
                        URL: `http://localhost:3000/saidas/${saidaRef.id}`,
                    },
                },
            };

            res.status(201).json({ response });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    getAllSaidas: async (req, res) => {
        try {
            // Busca todos os documentos na coleção 'saidas'
            const saidasSnapshot = await db.collection("saidas").get();

            // Cria um array vazio para armazenar os dados dos saidas.
            const saidas = [];

            // Itera sobre cada documento
            saidasSnapshot.forEach((saidaRef) => {
                // Extrai os dados do produto
                const saidaData = saidaRef.data();
                // Convertendo o timestamp do Firestore para JavaScript Date
                const dataFormatted = saidaData.data.toDate().toISOString().split('T')[0];
                // Adiciona os dados do produto ao array
                saidas.push({
                    id_saida: saidaRef.id,
                    data: dataFormatted,
                    quantidade: saidaData.quantidade,
                    id_produto: saidaData.id_produto.id,
                    request: {
                        tipo: "GET",
                        descrição: "Obter saida por ID",
                        URL: `http://localhost:3000/saidas/${saidaRef.id}`,
                    },
                });
            });
            res.status(200).json(saidas);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    getSaidaById: async (req, res) => {
        try {
            // Cria uma referência nos saidas usando o id
            const saidaRef = db.collection("saidas").doc(req.params.id);

            // Busca os dados do saida
            const saidaDoc = await saidaRef.get();

            // Verifica se o saida existe.
            if (!saidaDoc.exists) {
                res.status(404).send("saida não encontrado");
            } else {
                // Extrai os dados do saida.
                const saidaData = saidaDoc.data();
                // Convertendo o timestamp do Firestore para JavaScript Date
                const dataFormatted = saidaData.data.toDate().toISOString().split('T')[0];
                // Constrói a resposta com os dados do saida
                const response = {
                    id_saida: saidaDoc.id,
                    data: dataFormatted,
                    quantidade: saidaData.quantidade,
                    id_produto: saidaData.id_produto.id,
                    request: {
                        tipo: "GET",
                        descrição: "Obter detalhes deste saida",
                        URL: `http://localhost:3000/saidas/${saidaDoc.id}`,
                    },
                };
                res.status(200).json(response);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    updateSaida: async (req, res) => {
        try {
            // Cria uma referência para a coleção 'produtos'
            const produtosRef = db.collection("produtos");
            // Busca a produto com o ID fornecido na requisição
            const produtoDocRef = produtosRef.doc(req.body.id_produto);

            // Verifica se a produto existe
            const produtoSnapshot = await produtoDocRef.get();
            if (!produtoSnapshot.exists) {
                return res.status(404).send({ message: "Produto não encontrado" });
            }

            // Cria uma referência nos Saidas usando o id
            const saidaRef = db.collection("saidas").doc(req.params.id);
            // Verifica se o saida existe
            const saidaDoc = await saidaRef.get();
            if (!saidaDoc.exists) {
                return res.status(404).send({ message: "Saida não encontrada" });
            }

            // Atualiza o saida com as novas informações
            await saidaRef.update({
                id_produto: produtoDocRef,
                data: new Date(req.body.data),
                quantidade: req.body.quantidade
            });

            // Constrói o objeto de resposta com informações sobre o saida atualizado
            const response = {
                mensagem: "Saida atualizada com sucesso",
                produtoCriado: {
                    id_saida: req.params.id,
                    data: req.body.data,
                    quantidade: req.body.quantidade,
                    id_produto: req.body.id_produto,
                    request: {
                        tipo: "GET",
                        descrição: "Obter saida por ID",
                        URL: `http://localhost:3000/saidas/${saidaRef.id}`,
                    },
                },
            };
            res.status(200).send(response);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    },

    deleteSaida: async (req, res) => {
        try {
            // Cria uma referência nos saidas usando o id
            const saidaRef = db.collection("saidas").doc(req.params.id);

            // Verifica se o saida existe
            const saidaDoc = await saidaRef.get();
            if (!saidaDoc.exists) {
                return res.status(404).send({ message: "Saida não encontrado" });
            }

            // Deleta o saida
            await saidaRef.delete();

            // Constrói o objeto de resposta
            const response = {
                message: "saida deletado com sucesso",
                request: {
                    tipo: "POST",
                    descrição: "Criar saida",
                    URL: "http://localhost:3000/saidas/",
                    body: {
                        id_produto: "String",
                        data: "Date",
                        quantidade: "Number",
                    },
                },
            };

            res.status(200).send(response);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
};

module.exports = SaidaController;