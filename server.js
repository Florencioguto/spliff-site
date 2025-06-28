const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static(__dirname)); // Servir arquivos estáticos

// Rota para listar imagens da pasta camisas
app.get('/api/camisas', (req, res) => {
  const dir = path.join(__dirname, 'camisas');
  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Erro ao ler a pasta' });
    // Filtra só imagens .jpeg, .jpg, .png
    const imagens = files.filter(f => /\.(jpe?g|png)$/i.test(f)).map(f => `camisas/${f}`);
    res.json(imagens);
  });
});

const PORT = 5500;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));