// backend/routes/productRoutes.js
const express = require('express');
const ProductModel = require('../models/ProductModel');
const upload = require('../middleware/upload');
const verifyAdmin = require('../middleware/auth'); // <--- Importamos seguridad
const fs = require('fs'); // Para borrar archivos viejos
const db = require('../config/db'); // Necesario para el update manual

const router = express.Router();

// RUTAS PÚBLICAS
router.get('/', async (req, res) => {
  const products = await ProductModel.getAll();
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await ProductModel.getById(req.params.id);
  res.json(product);
});

// RUTAS PROTEGIDAS (Solo Admin)

// 1. CREAR (POST) - AHORA PROTEGIDO
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Imagen obligatoria' });
  const image_url = req.file.path;
  const { name, description, price, stock } = req.body;

  try {
    const newProduct = await ProductModel.create(name, description, price, stock, image_url);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. ELIMINAR (DELETE)
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        // Primero obtenemos el producto para saber qué imagen borrar
        const product = await ProductModel.getById(id);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

        // Borrar de la DB
        await db.query('DELETE FROM products WHERE id = $1', [id]);

        // Opcional: Borrar archivo de imagen del servidor
        if (product.image_url && fs.existsSync(product.image_url)) {
            fs.unlinkSync(product.image_url);
        }

        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

// 3. EDITAR (PUT)
router.put('/:id', verifyAdmin, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    
    try {
        // Lógica: Si suben imagen nueva, usamos esa. Si no, mantenemos la vieja.
        let updateQuery;
        let values;

        if (req.file) {
            // Caso A: Con imagen nueva
            updateQuery = `
                UPDATE products 
                SET name=$1, description=$2, price=$3, stock=$4, image_url=$5 
                WHERE id=$6 RETURNING *`;
            values = [name, description, price, stock, req.file.path, id];
        } else {
            // Caso B: Sin imagen (solo texto)
            updateQuery = `
                UPDATE products 
                SET name=$1, description=$2, price=$3, stock=$4 
                WHERE id=$5 RETURNING *`;
            values = [name, description, price, stock, id];
        }

        const { rows } = await db.query(updateQuery, values);
        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

module.exports = router;