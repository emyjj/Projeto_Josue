const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
    const authorization = req.get('authorization');
    const token = authorization?.startsWith('Bearer ')
        ? authorization.slice(7).trim()
        : req.body?.token;

    if (typeof token !== 'string' || !token.trim()) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

const autorizar = (perfisPermitidos) => {
    return (req, res, next) => {
        if (!perfisPermitidos.includes(req.usuario.perfil)) {
            return res.status(403).json({ error: 'Acesso negado' });
        }
        next();
    };
};

module.exports = { autenticar, autorizar };