const express = require('express');
const router = express.Router();
const EntradaController = require('../controllers/EntradaController');

// Rota para criar uma nova entrada
router.post('/entradas', EntradaController.createEntrada);

// Rota para obter todos as entradas
router.get('/entradas', EntradaController.getAllEntradas);

// Rota para obter uma entrada pelo ID
router.get('/entradas/:id', EntradaController.getEntradaById);

// Rota para atualizar uma entrada
router.put('/entradas/:id', EntradaController.updateEntrada);

// Rota para deletar uma entrada
router.delete('/entradas/:id', EntradaController.deleteEntrada);

module.exports = router;