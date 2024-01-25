const db = require("../firebaseConfig");

const ProdutoController = {
  // Adiciona um novo produto no sistema
  criarProduto: async (req, res) => {
    try {
      // Pega uma referência para a coleção 'categorias'
      const categoriasRef = db.collection("categorias");
      // Busca a categoria com o ID fornecido na requisição
      const categoriaSnapshot = await categoriasRef
        .doc(req.body.id_categorias)
        .get();

      // Verifica se a categoria existe
      if (!categoriaSnapshot.exists) {
        return res.status(404).send({ message: "categoria não encontrada" });
      }

      // Pega uma referência para a coleção 'produtos'
      const produtosRef = db.collection("produtos");
      // Cria um novo documento produto na coleção 'produto'
      const produtoRef = produtosRef.doc();

      // Define os dados do novo produto com as informações recebidas
      await produtoRef.set({
        name: req.body.nome,
        price: req.body.preço,
        id_categorias: req.body.id_categorias,
      });

      // Constrói o objeto de resposta com informações sobre o produto criado
      const response = {
        mensagem: "Produto inserido com sucesso",
        produtoCriado: {
          id_produto: produtoRef.id,
          nome: req.body.nome,
          preço: req.body.preço,
          id_categorias: req.body.id_categorias,
          request: {
            tipo: "GET",
            descrição: "Obter produto por ID",
            URL: `http://localhost:3000/products/${produtoRef.id}`,
          },
        },
      };
      res.status(201).json({ response });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getAllProdutos: async (req, res) => {
    try {
      const produtosSnapshot = await db.collection("produtos").get();
      const produtos = [];
      produtosSnapshot.forEach((doc) => {
        produtos.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).json(produtos);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getProdutoById: async (req, res) => {
    try {
      const produtoRef = db.collection("produtos").doc(req.params.id);
      const doc = await produtoRef.get();
      if (!doc.exists) {
        res.status(404).send("Produto não encontrado");
      } else {
        res.status(200).json({ id: doc.id, ...doc.data() });
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  updateProduto: async (req, res) => {
    try {
      const produtoRef = db.collection("produtos").doc(req.params.id);
      await produtoRef.update(req.body);
      res.status(200).send("Produto atualizado com sucesso");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  deleteProduto: async (req, res) => {
    try {
      const produtoRef = db.collection("produtos").doc(req.params.id);
      await produtoRef.delete();
      res.status(200).send("Produto deletado com sucesso");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

module.exports = ProdutoController;
