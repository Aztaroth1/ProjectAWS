// backend/models/ProductModel.js

const db = require('../config/db');

class ProductModel {
  
  // 1. Obtener todos
  static async getAll() {
    const queryText = 'SELECT * FROM products ORDER BY id ASC';
    const { rows } = await db.query(queryText);
    return rows;
  }

  // 2. Obtener por ID
  static async getById(id) {
    const queryText = 'SELECT * FROM products WHERE id = $1';
    const { rows } = await db.query(queryText, [id]);
    return rows[0];
  }

  // 3. CREAR PRODUCTO (ESTA ES LA QUE FALTABA)
  static async create(name, description, price, stock, image_url) {
    const queryText = `
      INSERT INTO products (name, description, price, stock, image_url) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`; 
    
    const values = [name, description || '', price, stock, image_url];
    const { rows } = await db.query(queryText, values);
    return rows[0];
  }
}

module.exports = ProductModel;