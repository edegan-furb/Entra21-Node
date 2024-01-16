const express = require('express');
const router = express.Router();
const saidaController = require('../controllers/SaidaController');

// Rota para criar uma nova saida
router.post('/saidas', saidaController.createSaida);

// Rota para obter todos as saidas
router.get('/saidas', saidaController.getAllSaidas);

// Rota para obter uma saida pelo ID
router.get('/saidas/:id', saidaController.getSaidaById);

// Rota para atualizar uma saida
router.put('/saidas/:id', saidaController.updateSaida);

// Rota para deletar uma saida
router.delete('/saidas/:id', saidaController.deleteSaida);

module.exports = router;