const pool = require("../config/bancoDeDados")
const bcrypt = require('bcrypt')

const cadatrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" })
    }
    try {
        let query = `SELECT * FROM usuarios WHERE email = $1`
        let valores = [email]
        const { rowCount: emailExistente } = await pool.query(query, valores)
        if (emailExistente) {
            return res.status(400).json({ mensagem: "E-mail ou senha inválidos" })
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10)
        query = `
            INSERT INTO
                usuarios (nome, email, senha)
            VALUES
                ($1, $2, $3)
            RETURNING *
        `
        valores = [nome, email, senhaCriptografada]
        const { rows: usuariosCadastrados } = await pool.query(query, valores)
        const usuarioCadastrado = usuariosCadastrados[0]
        delete usuarioCadastrado.senha
        return res.status(201).json(usuarioCadastrado)
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servidor" })
    }
    
}

module.exports = {
    cadatrarUsuario
}