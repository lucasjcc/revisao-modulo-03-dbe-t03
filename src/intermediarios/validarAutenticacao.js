const { senhaToken } = require("../../dadosSensiveis")
const pool = require("../config/bancoDeDados")
const jwt = require('jsonwebtoken')

const validarAutenticacao = async (req, res, next) => {
    const autorizacao = req.headers.authorization
    if (!autorizacao) {
        return res.status(401).json({ mensagem: "Usuário não logado" })
    }
    const token = autorizacao.split(" ")[1]
    try {
        const { id: usuarioLogadoId } = jwt.verify(token, senhaToken)
        let query = `SELECT * FROM usuarios WHERE id = $1`
        let valores = [usuarioLogadoId]
        const { rowCount: quantidadeUsuariosCadastrados, rows: usuariosCadastrados } = await pool.query(query, valores)
        if (quantidadeUsuariosCadastrados === 0) {
            return res.status(401).json({ mensagem: "Usuário não permitido" })
        }
        const usuarioLogado = usuariosCadastrados[0]
        delete usuarioLogado.senha
        req.usuarioLogado = usuarioLogado
        return next()
    } catch(error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: "Erro interno no servidor" })
    }
}

module.exports = validarAutenticacao