const obterTodosUsuarios = async () => {
    const mockUsuarios = [
        {
            id: 1,
            nome: 'João',
            email: 'joao@email.com'
        },
        {
            id: 2,
            nome: 'Maria',
            email: 'maria@email.com'
        }
    ];
    return mockUsuarios;
};

module.exports = {
    obterTodosUsuarios,
};