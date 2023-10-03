const express = require('express')
const { cadatrarUsuario } = require('./controladores/usuarios')

const rotas = express()

rotas.post('/usuarios', cadatrarUsuario)

module.exports = rotas