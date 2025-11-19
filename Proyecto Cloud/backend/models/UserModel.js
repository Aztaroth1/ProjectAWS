// backend/models/UserModel.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

class UserModel {
  // 1. Crear un nuevo usuario (Registro)
  static async create(email, password, fullName) {
    // Encriptamos la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users (email, password, full_name)
      VALUES ($1, $2, $3)
      RETURNING id, email, full_name, role
    `;
    
    try {
      const { rows } = await db.query(query, [email, hashedPassword, fullName]);
      return rows[0];
    } catch (error) {
      // El código 23505 en PostgreSQL significa "Violación de unicidad" (Email repetido)
      if (error.code === '23505') {
        throw new Error('El correo electrónico ya está registrado.');
      }
      throw error;
    }
  }

  // 2. Buscar usuario por Email (Login)
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await db.query(query, [email]);
    return rows[0]; // Retorna el usuario o undefined
  }
}

module.exports = UserModel;