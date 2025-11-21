// backend/server.js
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importación de Rutas y Configuración
const db = require('./config/db'); 
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// --- CAPA DE SEGURIDAD ---

// 1. Helmet: Protege cabeceras HTTP
// (crossOriginResourcePolicy: false es necesario para ver las imágenes de la carpeta uploads)
app.use(helmet({ crossOriginResourcePolicy: false }));

// 2. Rate Limiting: Evita ataques de fuerza bruta o DoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 peticiones por IP
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos.'
});
app.use(limiter);

// 3. CORS: Control de acceso
// Solo permitimos peticiones desde tu Frontend (localhost:5173)
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8080'], // Permitimos ambas variantes locales
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- CONFIGURACIÓN GENERAL ---

app.use(express.json()); // Para entender JSON

// Carpeta pública para imágenes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- RUTAS DE LA API ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Ruta de prueba base
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: '¡Bienvenido a la API REST del E-commerce!',
    status: 'OK'
  });
});

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Prueba de conexión a DB
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