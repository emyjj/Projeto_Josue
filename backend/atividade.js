const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/mensagem', (req, res) => {
    res.json({ texto: 'Olá do servidor!' });
});

app.get('/cep/:cep', async (req, res) => {
    const { cep } = req.params;

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            return res.status(404).json({ error: 'CEP não encontrado' });
        }

        return res.status(200).json(dados);
    } catch (error) {
        return res.status(500).json({ error: 'Erro de comunicação com VIACEP' });
    }
});

app.listen(3001, () => {
    console.log('Servidor rodando em http://localhost:3001');
});
