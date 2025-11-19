// routes/orderRoutes.js
const express = require('express');
const OrderModel = require('../models/OrderModel');

const router = express.Router();

// POST /api/orders
router.post('/', async (req, res) => {
  // Ahora esperamos recibir también userId (opcional por ahora)
  const { total, items, userId } = req.body; 

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío.' });
  }

  try {
    // Pasamos el userId al modelo
    const orderId = await OrderModel.createOrder(total, items, userId);
    
    res.status(201).json({ 
      message: 'Compra realizada y stock actualizado', 
      orderId: orderId 
    });
  } catch (err) {
    console.error('Error al crear la orden:', err.message);
    
    // Si el error es por falta de stock, enviamos un código 400 (Bad Request)
    if (err.message.includes('No hay suficiente stock')) {
        return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Error interno al procesar la orden.' });
  }
});

module.exports = router;