const { Pool } = require('pg')
const { host, port, database, user, password } = require('../../dadosSensiveis')
 
const pool = new Pool({
  host,
  port,
  database,
  user,
  password
})

module.exports = pool