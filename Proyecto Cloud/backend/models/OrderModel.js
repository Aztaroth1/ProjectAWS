// models/OrderModel.js
const db = require('../config/db');

class OrderModel {
  static async createOrder(total, items, userId) { // <--- Ahora recibimos userId
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN'); // Inicia la transacción

      // 1. Verificar Stock y Restarlo (Paso Crítico)
      for (const item of items) {
        // Consultamos el stock actual del producto
        const resProduct = await client.query('SELECT stock FROM products WHERE id = $1', [item.productId]);
        const currentStock = resProduct.rows[0].stock;

        // Validamos si alcanza
        if (currentStock < item.quantity) {
            throw new Error(`No hay suficiente stock del producto: ${item.name}. Stock actual: ${currentStock}`);
        }

        // Restamos el stock
        await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [
            item.quantity, 
            item.productId
        ]);
      }

      // 2. Insertar la Orden (Cabecera)
      // Fíjate que ahora ponemos status = 'completed' asumiendo que la simulación de pago pasó
      // Y guardamos el user_id (que puede ser null si no hay usuario logueado todavía)
      const orderQuery = `
        INSERT INTO orders (total_amount, status, user_id) 
        VALUES ($1, 'completed', $2) 
        RETURNING id
      `;
      const orderResult = await client.query(orderQuery, [total, userId || null]);
      const orderId = orderResult.rows[0].id;

      // 3. Insertar los Ítems de la Orden (Detalle)
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
      }

      await client.query('COMMIT'); // Confirmamos la compra
      return orderId;

    } catch (error) {
      await client.query('ROLLBACK'); // Si falla algo (ej: falta de stock), cancelamos todo
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = OrderModel;