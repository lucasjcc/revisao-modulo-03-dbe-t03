const express = require('express')
const { cadatrarUsuario, logarUsuario, editarUsuario } = require('./controladores/usuarios')
const validarCorpoCadastroEdicao = require('./intermediarios/validarCorpoCadastroEdicao')
const validarAutenticacao = require('./intermediarios/validarAutenticacao')

const rotas = express()

rotas.post('/usuarios', validarCorpoCadastroEdicao, cadatrarUsuario)
rotas.post('/login', logarUsuario)

rotas.use(validarAutenticacao)

rotas.put('/usuarios', validarCorpoCadastroEdicao, editarUsuario)

module.exports = rotas