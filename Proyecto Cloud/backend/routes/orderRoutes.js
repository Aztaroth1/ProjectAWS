// routes/orderRoutes.js
const express = require('express');
const OrderModel = require('../models/OrderModel');

const router = express.Router();

// POST /api/orders
// Recibe: { total: 100.50, items: [...] }
router.post('/', async (req, res) => {
  const { total, items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío.' });
  }

  try {
    const orderId = await OrderModel.createOrder(total, items);
    res.status(201).json({ 
      message: 'Orden creada exitosamente', 
      orderId: orderId 
    });
  } catch (err) {
    console.error('Error al crear la orden:', err);
    res.status(500).json({ error: 'Error interno al procesar la orden.' });
  }
});

module.exports = router;