'use strict'

require('dotenv').config()

const dbDetails = {
  username: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  host: process.env.MYSQL_DB_ADDRESS,
  dialect: 'mysql'
}

module.exports = {
  development: dbDetails,
  production: dbDetails
}
