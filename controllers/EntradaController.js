const db = require('../firebaseConfig');

const EntradaController = {
    createEntrada: async (req, res) => {
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


            // Pega uma referência para a coleção 'entradas'
            // Cria um novo documento entrada na coleção 'entrada'
            const entradaRef = db.collection('entradas').doc();
            // Define os dados do nova entrada com as informações recebidas
            await entradaRef.set({
                id_produto: produtoDocRef,
                data: new Date(req.body.data),
                quantidade: req.body.quantidade
            });

            // Constrói o objeto de resposta com informações sobre a entrada criada
            const response = {
                mensagem: "Entrada inserida com sucesso",
                entradaCriada: {
                    id_entrada: entradaRef.id,
                    data: req.body.data,
                    quantidade: req.body.quantidade,
                    id_produto: req.body.produtoDocRef,
                    request: {
                        tipo: "GET",
                        descrição: "Obter entrada por ID",
                        URL: `http://localhost:3000/entradas/${entradaRef.id}`,
                    },
                },
            };

            res.status(201).json({ response });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    getAllEntradas: async (req, res) => {
        try {
            // Busca todos os documentos na coleção 'entradas'
            const entradasSnapshot = await db.collection("entradas").get();

            // Cria um array vazio para armazenar os dados dos entradas.
            const entradas = [];

            // Itera sobre cada documento
            entradasSnapshot.forEach((entradaRef) => {
                // Extrai os dados do produto
                const entradaData = entradaRef.data();
                // Convertendo o timestamp do Firestore para JavaScript Date
                const dataFormatted = entradaData.data.toDate().toISOString().split('T')[0];
                // Adiciona os dados do produto ao array
                entradas.push({
                    id_entrada: entradaRef.id,
                    data: dataFormatted,
                    quantidade: entradaData.quantidade,
                    id_produto: entradaData.id_produto.id,
                    request: {
                        tipo: "GET",
                        descrição: "Obter entrada por ID",
                        URL: `http://localhost:3000/entradas/${entradaRef.id}`,
                    },
                });
            });
            res.status(200).json(entradas);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    getEntradaById: async (req, res) => {
        try {
            // Cria uma referência nos entradas usando o id
            const entradaRef = db.collection("entradas").doc(req.params.id);

            // Busca os dados do entrada
            const entradaDoc = await entradaRef.get();

            // Verifica se o entrada existe.
            if (!entradaDoc.exists) {
                res.status(404).send("entrada não encontrado");
            } else {
                // Extrai os dados do entrada.
                const entradaData = entradaDoc.data();
                // Convertendo o timestamp do Firestore para JavaScript Date
                const dataFormatted = entradaData.data.toDate().toISOString().split('T')[0];
                // Constrói a resposta com os dados do entrada
                const response = {
                    id_entrada: entradaDoc.id,
                    data: dataFormatted,
                    quantidade: entradaData.quantidade,
                    id_produto: entradaData.id_produto.id,
                    request: {
                        tipo: "GET",
                        descrição: "Obter detalhes deste entrada",
                        URL: `http://localhost:3000/entradas/${entradaDoc.id}`,
                    },
                };
                res.status(200).json(response);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    updateEntrada: async (req, res) => {
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

            // Cria uma referência nos entradas usando o id
            const entradaRef = db.collection("entradas").doc(req.params.id);
            // Verifica se o entrada existe
            const entradaDoc = await entradaRef.get();
            if (!entradaDoc.exists) {
                return res.status(404).send({ message: "Entrada não encontrada" });
            }

            // Atualiza o entrada com as novas informações
            await entradaRef.update({
                id_produto: produtoDocRef,
                data: new Date(req.body.data),
                quantidade: req.body.quantidade
            });

            // Constrói o objeto de resposta com informações sobre o entrada atualizado
            const response = {
                mensagem: "Entrada atualizada com sucesso",
                produtoCriado: {
                    id_entrada: req.params.id,
                    data: req.body.data,
                    quantidade: req.body.quantidade,
                    id_produto: req.body.id_produto,
                    request: {
                        tipo: "GET",
                        descrição: "Obter entrada por ID",
                        URL: `http://localhost:3000/entradas/${entradaRef.id}`,
                    },
                },
            };
            res.status(200).send(response);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    },

    deleteEntrada: async (req, res) => {
        try {
            // Cria uma referência nos entradas usando o id
            const entradaRef = db.collection("entradas").doc(req.params.id);

            // Verifica se o entrada existe
            const entradaDoc = await entradaRef.get();
            if (!entradaDoc.exists) {
                return res.status(404).send({ message: "Entrada não encontrado" });
            }

            // Deleta o entrada
            await entradaRef.delete();

            // Constrói o objeto de resposta
            const response = {
                message: "Entrada deletado com sucesso",
                request: {
                    tipo: "POST",
                    descrição: "Criar entrada",
                    URL: "http://localhost:3000/entradas/",
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

module.exports = EntradaController;