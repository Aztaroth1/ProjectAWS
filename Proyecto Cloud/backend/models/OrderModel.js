// models/OrderModel.js
const db = require('../config/db');

class OrderModel {
  static async createOrder(total, items) {
    // Obtenemos un cliente del pool para manejar la transacción
    const client = await db.pool.connect();

    try {
      // 1. Iniciar la Transacción
      await client.query('BEGIN');

      // 2. Insertar la Orden (Cabecera)
      const orderQuery = 'INSERT INTO orders (total_amount) VALUES ($1) RETURNING id';
      const orderResult = await client.query(orderQuery, [total]);
      const orderId = orderResult.rows[0].id;

      // 3. Insertar los Ítems de la Orden
      const itemQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
        VALUES ($1, $2, $3, $4)
      `;

      for (const item of items) {
        await client.query(itemQuery, [
          orderId,
          item.productId,
          item.quantity,
          item.price
        ]);
        
        // Opcional: Aquí podrías restar el stock del producto
        // UPDATE products SET stock = stock - $1 WHERE id = $2
      }

      // 4. Confirmar la Transacción (Commit)
      await client.query('COMMIT');
      return orderId;

    } catch (error) {
      // Si algo falla, revertimos todo (Rollback)
      await client.query('ROLLBACK');
      throw error;
    } finally {
      // Liberamos el cliente
      client.release();
    }
  }
}

module.exports = OrderModel;