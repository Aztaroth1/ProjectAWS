// routes/productRoutes.js

const express = require('express');
const ProductModel = require('../models/ProductModel'); // Importamos el Modelo

const router = express.Router();

// Ruta 1: GET /
// Obtiene todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await ProductModel.getAll();
    res.status(200).json(products);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error interno del servidor al obtener productos.' });
  }
});

// Ruta 2: GET /:id
// Obtiene un producto por su ID
router.get('/:id', async (req, res) => {
  try {
    const product = await ProductModel.getById(req.params.id);
    if (!product) {
      // Si el producto no existe, devolvemos 404
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error('Error al obtener producto por ID:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;