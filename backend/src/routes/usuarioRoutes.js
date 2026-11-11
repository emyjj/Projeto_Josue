const express = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

router.post('/', usuarioController.criarUsuario);

router.get('/', usuarioController.buscarUsuarios);
router.get('/:id', usuarioController.buscarUsuarioPorId);
router.put('/:id', usuarioController.atualizarUsuario);
router.delete('/:id', usuarioController.excluirUsuario);

router.put('/:id/foto', autenticar, uploadImagem('foto'), usuarioController.editarFoto);
router.delete('/:id/foto', autenticar, usuarioController.removerFoto);
module.exports = router;