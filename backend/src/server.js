const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const router= require('./routes/routes');

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});