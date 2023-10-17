const pool = require("../config/bancoDeDados")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { senhaToken } = require("../../dadosSensiveis")

const cadatrarUsuario = async (req, res) => {
    try {
        const { nome, email, senha } = req.body
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

const logarUsuario = async (req, res) => {
    const { email, senha } = req.body

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" })
    }

    try {
        const comandoSql = `SELECT * FROM usuarios WHERE email = $1;`
        const valores = [email]
        const { rowCount: quantidadeEmailsCadastrados, rows: usuariosCadastrados } = await pool.query(comandoSql, valores)
        if (quantidadeEmailsCadastrados === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" })
        }
        const usuarioCadastrado = usuariosCadastrados[0]
        const senhaConfere = await bcrypt.compare(senha, usuarioCadastrado.senha)
        if (!senhaConfere) {
            return res.status(401).json({ mensagem: "Senha inválida" })
        }
        const token = jwt.sign({ id: usuarioCadastrado.id }, senhaToken, { expiresIn: '1h' })
        return res.json({ token })
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servidor" })
    }
}

const editarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    try {
        const { usuarioLogado } = req
        query = `SELECT * FROM usuarios WHERE email = $1 AND id <> $2`
        valores = [email, usuarioLogado.id]
        const { rowCount: emailExisteEmOutroUsuario } = await pool.query(query, valores)
        if (emailExisteEmOutroUsuario) {
            return res.status(400).json({ mensagem: "E-mail ou senha inválidos" })
        }
        query = `
            UPDATE usuarios
            SET nome = $1, email = $2, senha = $3
            WHERE id = $4;
        `
        const senhaCriptografada = await bcrypt.hash(senha, 10)
        valores = [nome, email, senhaCriptografada, usuarioLogado.id]
        await pool.query(query, valores)
        return res.status(204).end()
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servidor" })
    }
}

module.exports = {
    cadatrarUsuario,
    logarUsuario,
    editarUsuario
}