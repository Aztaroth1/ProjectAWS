// models/ProductModel.js

const db = require('../config/db'); // Importamos nuestra conexión a PostgreSQL

class ProductModel {
  /**
   * Obtiene todos los productos de la tabla 'products'.
   */
  static async getAll() {
    // Aquí usamos la función query que creamos en config/db.js
    const queryText = 'SELECT * FROM products ORDER BY id ASC';
    const { rows } = await db.query(queryText);
    return rows;
  }

  /**
   * Obtiene un producto por su ID.
   */
  static async getById(id) {
    const queryText = 'SELECT * FROM products WHERE id = $1';
    // Usamos el array [id] para prevenir inyección SQL (parametrización)
    const { rows } = await db.query(queryText, [id]);
    return rows[0]; 
  }
}

module.exports = ProductModel;