// server.js
const path = require('path');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); //Autenticación
require('dotenv').config(); 
console.log('Password leída:', process.env.DB_PASSWORD);
// Importamos nuestro módulo de conexión a la DB
const db = require('./config/db'); 
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(cors()); 
app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/products', productRoutes); // <--- NUEVA: Usar el Router
app.use('/api/orders', orderRoutes); // <--- 2. USAR LA RUTA DE ORDENES
app.use('/api/auth', authRoutes); // Rutas de autenticación

// Ruta de prueba
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: '¡Bienvenido a la API REST del E-commerce!',
    status: 'OK'
  });
});

const PORT = process.env.PORT || 3000;

// Función para iniciar el servidor
const startServer = async () => {
    try {
        // Intenta conectar a la base de datos
        await db.pool.connect();
        console.log('✅ Conexión exitosa a PostgreSQL (ecommerce_db).');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Error al conectar con la base de datos PostgreSQL:', error.message);
        console.log('❌ El servidor NO pudo iniciar. Revisa tus credenciales en el archivo .env.');
        process.exit(1); 
    }
};

startServer();