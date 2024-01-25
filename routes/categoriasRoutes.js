const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/CategoriaController');

// Rota para criar uma nova categorias
router.post('/categorias', CategoriaController.createCategoria);

// Rota para obter todos as categorias
router.get('/categorias', CategoriaController.getAllCategorias);

// Rota para obter uma categoria pelo ID
router.get('/categorias/:id', CategoriaController.getCategoriaById);

// Rota para atualizar uma categoria
router.put('/categorias/:id', CategoriaController.updateCategoria);

// Rota para deletar uma categoria
router.delete('/categorias/:id', CategoriaController.deleteCategoria);

module.exports = router;