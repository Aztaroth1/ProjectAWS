// backend/config/db.js
const { Pool } = require('pg');
require('dotenv').config(); // Aseguramos que este archivo también cargue las variables por si acaso

// Verificación de seguridad en consola (borrar en producción)
console.log('Intentando conectar con usuario:', process.env.DB_USER);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  // Aquí forzamos que sea un string para evitar el error "must be a string"
  password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD.toString() : undefined,
  port: process.env.DB_PORT,
});

const query = (text, params) => pool.query(text, params);

module.exports = {
  query,
  pool,
};