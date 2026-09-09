const express = require('express');
const router = express.Router();
const usuarioRoutes = require('./usuarioRoutes');

router.use('/usuarios', usuarioRoutes);

module.exports = router;