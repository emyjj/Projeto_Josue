const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.get('/api/mensagem', (req,res) =>{
    res.json({ texto:"Olá do servidor!"});
});

app.listen(3000);
