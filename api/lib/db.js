const mysql = require('mysql2/promise');  // Version async/await
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,  // Nombre max de connexions
  queueLimit: 0
};

// Crée un pool de connexions (optimise les performances)
const pool = mysql.createPool(dbConfig);

module.exports = pool;