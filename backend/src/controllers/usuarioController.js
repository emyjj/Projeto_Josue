const usuarioService = require('../services/usuarioService');
const { geocodificarEndereco } = require('../services/geocodingService');
const bcrypt = require('bcrypt');

const resolverEndereco = async (dadosEndereco, res) => {
    const limites = {
        rua: 255,
        numero: 50,
        bairro: 150,
        cidade: 150,
        estado: 100,
        cep: 20,
        pais: 100,
    };
    const componentes = Object.fromEntries(
        Object.entries(limites).map(([campo, limite]) => [campo, dadosEndereco[campo]?.trim() || null])
    );

    for (const [campo, limite] of Object.entries(limites)) {
        if (componentes[campo]?.length > limite) {
            res.status(400).json({ error: `O campo ${campo} deve ter no máximo ${limite} caracteres` });
            return null;
        }
    }

    const partesEndereco = [
        [componentes.rua, componentes.numero].filter(Boolean).join(', '),
        componentes.bairro,
        componentes.cidade,
        componentes.estado,
        componentes.cep,
        componentes.pais,
    ].filter(Boolean);
    const enderecoNormalizado = partesEndereco.join(', ') || dadosEndereco.endereco?.trim() || null;
    const temEnderecoLocalizavel = componentes.rua || componentes.bairro || componentes.cidade
        || componentes.cep || dadosEndereco.endereco?.trim();

    if (!enderecoNormalizado || !temEnderecoLocalizavel) {
        return {
            endereco: null,
            ...Object.fromEntries(Object.keys(limites).map((campo) => [campo, null])),
            latitude: null,
            longitude: null,
            precisaoLocalizacao: null,
            localizada: false,
        };
    }
    if (enderecoNormalizado.length > 500) {
        res.status(400).json({ error: 'O endereço completo deve ter no máximo 500 caracteres' });
        return null;
    }

    const precisaoEndereco = componentes.rua || componentes.numero
        ? 'endereco'
        : componentes.bairro ? 'bairro' : 'cidade';
    const consultas = [
        { query: enderecoNormalizado, precisao: precisaoEndereco },
        {
            query: [componentes.bairro, componentes.cidade, componentes.estado, componentes.pais].filter(Boolean).join(', '),
            precisao: 'bairro',
        },
        {
            query: [componentes.cidade, componentes.estado, componentes.pais].filter(Boolean).join(', '),
            precisao: 'cidade',
        },
    ].filter((consulta, index, todas) => consulta.query
        && todas.findIndex((outra) => outra.query === consulta.query) === index);

    for (const consulta of consultas) {
        try {
            const localizacao = await geocodificarEndereco(consulta.query);
            if (localizacao) {
                return {
                    endereco: enderecoNormalizado,
                    ...componentes,
                    ...localizacao,
                    precisaoLocalizacao: consulta.precisao,
                    localizada: consulta.precisao,
                };
            }
        } catch (error) {
            console.error('Erro ao consultar Nominatim:', error);
            break;
        }
    }

    return {
        endereco: enderecoNormalizado,
        ...componentes,
        latitude: null,
        longitude: null,
        precisaoLocalizacao: null,
        localizada: false,
    };
};

const buscarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.obterTodosUsuarios();
        res.status(200).json({ data: usuarios });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro interno ao buscar usuários' });
    }
};

const buscarUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.obterUsuarioPorId(id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.status(200).json({ data: usuario });
    } catch (error) {
        console.error('Erro ao buscar usuário por ID:', error);
        return res.status(500).json({ error: 'Erro interno ao buscar usuário' });
    }
};

const criarUsuario = async (req, res) => {
    try {
        const { nome, email, senha, foto, endereco, rua, numero, bairro, cidade, estado, cep, pais } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
        }
        const localizacao = await resolverEndereco({ endereco, rua, numero, bairro, cidade, estado, cep, pais }, res);
        if (!localizacao) return;
        const { localizada, ...dadosLocalizacao } = localizacao;

        const hash = await bcrypt.hash(senha, 10);
        const usuario = await usuarioService.criarUsuario({
            nome, email, senha: hash, foto: foto || null, ...dadosLocalizacao,
        });
        const dadosUsuario = usuario.toJSON();
        delete dadosUsuario.senha;
        const message = !localizada && dadosLocalizacao.endereco
            ? 'Usuário criado, mas o endereço não foi localizado; confira os dados para exibir no mapa'
            : localizada === 'bairro'
                ? 'Usuário criado; o marcador mostra uma posição aproximada pelo bairro'
                : localizada === 'cidade'
                    ? 'Usuário criado; o marcador mostra uma posição aproximada pela cidade'
                    : 'Usuário criado com sucesso';
        return res.status(201).json({ data: dadosUsuario, message });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'Já existe um usuário com este email' });
        }

        return res.status(500).json({ error: 'Erro interno ao criar usuário' });
    }
};

const atualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, senha, foto, endereco, rua, numero, bairro, cidade, estado, cep, pais } = req.body;
        const senhaHash = senha ? await bcrypt.hash(senha, 10) : undefined;
        const dadosUsuario = {
            nome,
            email,
            senha: senhaHash,
            foto: foto || null,
        };
        const dadosEndereco = { endereco, rua, numero, bairro, cidade, estado, cep, pais };
        let enderecoLocalizado;
        if (Object.values(dadosEndereco).some((valor) => valor !== undefined)) {
            const localizacao = await resolverEndereco(dadosEndereco, res);
            if (!localizacao) return;
            const { localizada, ...dadosLocalizacao } = localizacao;
            enderecoLocalizado = localizada;
            Object.assign(dadosUsuario, dadosLocalizacao);
        }

        const usuarioAtualizado = await usuarioService.atualizarUsuario(id, dadosUsuario);

        if (!usuarioAtualizado) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const message = !enderecoLocalizado && dadosUsuario.endereco
            ? 'Usuário atualizado, mas o endereço não foi localizado; confira os dados para exibir no mapa'
            : enderecoLocalizado === 'bairro'
                ? 'Usuário atualizado; o marcador mostra uma posição aproximada pelo bairro'
                : enderecoLocalizado === 'cidade'
                    ? 'Usuário atualizado; o marcador mostra uma posição aproximada pela cidade'
                    : 'Usuário atualizado com sucesso';
        return res.status(200).json({ data: usuarioAtualizado, message });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'Já existe um usuário com este email' });
        }

        return res.status(500).json({ error: 'Erro interno ao atualizar usuário' });
    }
};

const excluirUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioExcluido = await usuarioService.excluirUsuario(id);

        if (!usuarioExcluido) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.status(200).json({ data: usuarioExcluido, message: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        return res.status(500).json({ error: 'Erro interno ao excluir usuário' });
    }
};

module.exports = {
    buscarUsuarios,
    buscarUsuarioPorId,
    criarUsuario,
    atualizarUsuario,
    excluirUsuario,
};