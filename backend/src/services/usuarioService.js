const Usuario = require('../models/Usuario');

const obterTodosUsuarios = async () => {
    return await Usuario.findAll({
        attributes: { exclude: ['senha'] }
    });
};

const obterUsuarioPorId = async (id) => {
    return await Usuario.findByPk(id, {
        attributes: { exclude: ['senha'] }
    });
};

const criarUsuario = async (dadosUsuario) => {
    return await Usuario.create(dadosUsuario);
};

const atualizarUsuario = async (id, dadosUsuario) => {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        return null;
    }

    await usuario.update(dadosUsuario);
    return await Usuario.findByPk(id, {
        attributes: { exclude: ['senha'] }
    });
};

const excluirUsuario = async (id) => {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        return null;
    }

    await usuario.destroy();
    return usuario;
};

const atualizarFoto = async (id, arquivo) => {
    const usuario = await obterUsuarioPorId(id);
    const fotoAntiga = usuario.foto;
    const chave = await storageService.enviarArquivo(arquivo.buffer, arquivo.mimetype, 'usuarios');
    arquivo.buffer, arquivo.mimetype, 'usuarios/${id}';
    await usuario.update({ foto: chave });
    await storageService.removerArquivo(fotoAntiga);
    return await paraResposta(usuario);
}

export const uploadFotoUsuario = async (id, arquivo) => {
    const formData = new FormData();
    formData.append('foto', arquivo);
    const res = await api.put(`/usuarios/${id}/foto`, formData);
    return res.data;
};

const arquivo = e.target.files?.[0];
setFoto({arquivo, preview: URL.createObjectURL(arquivo)});

const salvo = await updateUsuario(id, form);
if (foto.arquivo) await uploadFotoUsuario(salvo.id, foto.arquivo);

module.exports = {
    obterTodosUsuarios,
    obterUsuarioPorId,
    criarUsuario,
    atualizarUsuario,
    excluirUsuario,
};