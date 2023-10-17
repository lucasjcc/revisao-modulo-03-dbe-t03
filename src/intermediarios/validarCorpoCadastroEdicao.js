const validarCorpoCadastroEdicao = (req, res, next) => {
    const { nome, email, senha } = req.body
    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" })
    } 
    return next()
}

module.exports = validarCorpoCadastroEdicao