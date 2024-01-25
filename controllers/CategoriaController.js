const db = require("../firebaseConfig");

const CategoriaController = {
    // Adiciona um novo categoria no sistema
    createCategoria: async (req, res) => {
        try {
            // Pega uma referência para a coleção 'categorias'
            const categoriasRef = db.collection("categorias");
            // Cria um novo documento categoria na coleção 'categoria'
            const categoriaRef = categoriasRef.doc();

            // Define os dados do novo categoria com as informações recebidas
            await categoriaRef.set({
                categoria: req.body.categoria,
            });

            // Constrói o objeto de resposta com informações sobre o categoria criado
            const response = {
                mensagem: "Categoria inserida com sucesso",
                categoriaCriada: {
                    id_categoria: categoriaRef.id,
                    categoria: req.body.categoria,
                    request: {
                        tipo: "GET",
                        descrição: "Obter categoria por ID",
                        URL: `http://localhost:3000/categorias/${categoriaRef.id}`,
                    },
                },
            };
            res.status(201).json({ response });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    // Retornar todos os categorias
    getAllCategorias: async (req, res) => {
        try {
            // Busca todos os documentos na coleção 'categorias'
            const categoriasSnapshot = await db.collection("categorias").get();

            // Cria um array vazio para armazenar os dados dos categorias.
            const categorias = [];

            // Itera sobre cada documento
            categoriasSnapshot.forEach((categoriaRef) => {
                // Extrai os dados do categoria
                const categoriaData = categoriaRef.data();
                // Adiciona os dados do categoria ao array
                categorias.push({
                    id_categoria: categoriaRef.id,
                    categoria: categoriaData.categoria,
                    request: {
                        tipo: "GET",
                        descrição: "Obter categoria por ID",
                        URL: `http://localhost:3000/categorias/${categoriaRef.id}`,
                    },
                });
            });
            res.status(200).json(categorias);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    // Retornar um categoria pelo seu ID.
    getCategoriaById: async (req, res) => {
        try {
            // Cria uma referência nos categorias usando o id
            const categoriaRef = db.collection("categorias").doc(req.params.id);

            // Busca os dados do categoria
            const categoriaDoc = await categoriaRef.get();

            // Verifica se o categoria existe.
            if (!categoriaDoc.exists) {
                res.status(404).send("Categoria não encontrado");
            } else {
                // Extrai os dados do categoria.
                const categoriaData = categoriaDoc.data();
                // Constrói a resposta com os dados do categoria
                const response = {
                    id_categoria: categoriaDoc.id,
                    categoria: categoriaData.categoria,
                    request: {
                        tipo: "GET",
                        descrição: "Obter categoria por ID",
                        URL: `http://localhost:3000/categorias/${categoriaRef.id}`,
                    },
                };
                res.status(200).json(response);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    // Atualiza as informações de um categoria
    updateCategoria: async (req, res) => {
        try {
            // Cria uma referência nos categorias usando o id
            const categoriaRef = db.collection("categorias").doc(req.params.id);
            // Verifica se o categoria existe
            const categoriaDoc = await categoriaRef.get();
            if (!categoriaDoc.exists) {
                return res.status(404).send({ message: "Categoria não encontrada" });
            }

            // Atualiza o categoria com as novas informações
            await categoriaRef.update({
                categoria: req.body.categoria,
            });

            // Constrói o objeto de resposta com informações sobre o categoria atualizado
            const response = {
                mensagem: "Categoria atualizado com sucesso",
                categoriaAtualizado: {
                    id_categoria: req.params.id,
                    categoria: req.body.categoria,
                    request: {
                        tipo: "GET",
                        descrição: "Obter categoria por ID",
                        URL: `http://localhost:3000/categorias/${req.params.id}`,
                    },
                },
            };
            res.status(200).send(response);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    },

    deleteCategoria: async (req, res) => {
        try {
            // Cria uma referência nos categorias usando o id
            const categoriaRef = db.collection("categorias").doc(req.params.id);

            // Verifica se o categoria existe
            const categoriaDoc = await categoriaRef.get();
            if (!categoriaDoc.exists) {
                return res.status(404).send({ message: "categoria não encontrado" });
            }

            // Deleta o categoria
            await categoriaRef.delete();

            // Constrói o objeto de resposta
            const response = {
                message: "Categoria deletado com sucesso",
                request: {
                    tipo: "POST",
                    descrição: "Criar categoria",
                    URL: "http://localhost:3000/categorias/",
                    body: {
                        categoria: "String"
                    },
                },
            };

            res.status(200).send(response);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
};

module.exports = CategoriaController;
