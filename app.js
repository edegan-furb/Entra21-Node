const express = require('express');
const app = express();

app.use(express.json());

// Importar rotas
const produtosRoutes = require('./routes/produtosRoutes');

// Usar rotas
app.use(produtosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
