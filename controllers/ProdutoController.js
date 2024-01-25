const db = require("../firebaseConfig");

const ProdutoController = {
  // Adiciona um novo produto no sistema
  createProduto: async (req, res) => {
    try {
      // Pega uma referência para a coleção 'categorias'
      const categoriasRef = db.collection("categorias");
      // Busca a categoria com o ID fornecido na requisição
      const categoriaDocRef = categoriasRef.doc(req.body.id_categorias);

      // Verifica se a categoria existe
      const categoriaSnapshot = await categoriaDocRef.get();
      if (!categoriaSnapshot.exists) {
        return res.status(404).send({ message: "categoria não encontrada" });
      }

      // Pega uma referência para a coleção 'produtos'
      const produtosRef = db.collection("produtos");
      // Cria um novo documento produto na coleção 'produto'
      const produtoRef = produtosRef.doc();

      // Define os dados do novo produto com as informações recebidas
      await produtoRef.set({
        nome: req.body.nome,
        preço: req.body.preço,
        id_categorias: categoriaDocRef,
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
            URL: `http://localhost:3000/produtos/${produtoRef.id}`,
          },
        },
      };
      res.status(201).json({ response });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  // Retornar todos os produtos
  getAllProdutos: async (req, res) => {
    try {
      // Busca todos os documentos na coleção 'produtos'
      const produtosSnapshot = await db.collection("produtos").get();

      // Cria um array vazio para armazenar os dados dos produtos.
      const produtos = [];

      // Itera sobre cada documento
      produtosSnapshot.forEach((produtoRef) => {
        // Extrai os dados do produto
        const produtoData = produtoRef.data();
        // Adiciona os dados do produto ao array
        produtos.push({
          id_produto: produtoRef.id,
          nome: produtoData.nome,
          preço: produtoData.preço,
          id_categorias: produtoData.id_categorias.id,
          request: {
            tipo: "GET",
            descrição: "Obter produto por ID",
            URL: `http://localhost:3000/produtos/${produtoRef.id}`,
          },
        });
      });
      res.status(200).json(produtos);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  // Retornar um produto pelo seu ID.
  getProdutoById: async (req, res) => {
    try {
      // Cria uma referência nos produtos usando o id
      const produtoRef = db.collection("produtos").doc(req.params.id);

      // Busca os dados do produto
      const produtoDoc = await produtoRef.get();

      // Verifica se o produto existe.
      if (!produtoDoc.exists) {
        res.status(404).send("Produto não encontrado");
      } else {
        // Extrai os dados do produto.
        const produtoData = produtoDoc.data();
        // Constrói a resposta com os dados do produto
        const response = {
          id_produto: produtoDoc.id,
          nome: produtoData.nome,
          preço: produtoData.preço,
          id_categorias: produtoData.id_categorias.id,
          request: {
            tipo: "GET",
            descrição: "Obter detalhes deste produto",
            URL: `http://localhost:3000/produtos/${produtoDoc.id}`,
          },
        };
        res.status(200).json(response);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  // Atualiza as informações de um produto
  updateProduto: async (req, res) => {
    try {
      // Cria uma referência para a coleção 'categorias'
      const categoriasRef = db.collection("categorias");
      // Busca a categoria com o ID fornecido na requisição
      const categoriaDocRef = categoriasRef.doc(req.body.id_categorias);

      // Verifica se a categoria existe
      const categoriaSnapshot = await categoriaDocRef.get();
      if (!categoriaSnapshot.exists) {
        return res.status(404).send({ message: "Categoria não encontrada" });
      }

      // Cria uma referência nos produtos usando o id
      const produtoRef = db.collection("produtos").doc(req.params.id);
      // Verifica se o produto existe
      const produtoDoc = await produtoRef.get();
      if (!produtoDoc.exists) {
        return res.status(404).send({ message: "Produto não encontrado" });
      }

      // Atualiza o produto com as novas informações
      await produtoRef.update({
        nome: req.body.nome,
        preço: req.body.preço,
        id_categorias: categoriaDocRef,
      });

      // Constrói o objeto de resposta com informações sobre o produto atualizado
      const response = {
        mensagem: "Produto atualizado com sucesso",
        produtoAtualizado: {
          id_produto: req.params.id,
          nome: req.body.nome,
          preço: req.body.preço,
          id_categorias: req.body.id_categorias.id,
          request: {
            tipo: "GET",
            descrição: "Obter produto por ID",
            URL: `http://localhost:3000/produtos/${req.params.id}`,
          },
        },
      };
      res.status(200).send(response);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  deleteProduto: async (req, res) => {
    try {
      // Cria uma referência nos produtos usando o id
      const produtoRef = db.collection("produtos").doc(req.params.id);

      // Verifica se o produto existe
      const produtoDoc = await produtoRef.get();
      if (!produtoDoc.exists) {
        return res.status(404).send({ message: "Produto não encontrado" });
      }

      // Deleta o produto
      await produtoRef.delete();

      // Constrói o objeto de resposta
      const response = {
        message: "Produto deletado com sucesso",
        request: {
          tipo: "POST",
          descrição: "Criar produto",
          URL: "http://localhost:3000/produtos/",
          body: {
            nome: "String",
            preço: "Number",
            id_categorias: "String",
          },
        },
      };

      res.status(200).send(response);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

module.exports = ProdutoController;
