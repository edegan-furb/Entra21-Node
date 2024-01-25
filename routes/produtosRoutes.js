const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/ProdutoController');

// Rota para criar um novo produto
router.post('/produtos', ProdutoController.createProduto);

// Rota para obter todos os produtos
router.get('/produtos', ProdutoController.getAllProdutos);

// Rota para obter um produto pelo ID
router.get('/produtos/:id', ProdutoController.getProdutoById);

// Rota para atualizar um produto
router.put('/produtos/:id', ProdutoController.updateProduto);

// Rota para deletar um produto
router.delete('/produtos/:id', ProdutoController.deleteProduto);

module.exports = router;