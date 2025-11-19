// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro';

// Middleware para verificar Token y Rol
const verifyAdmin = (req, res, next) => {
  // 1. Buscar el token en la cabecera (Authorization: Bearer eyJ...)
  const tokenHeader = req.headers['authorization'];
  
  if (!tokenHeader) {
    return res.status(403).json({ error: 'Acceso denegado. No hay token.' });
  }

  try {
    // Limpiamos el prefijo "Bearer " si existe
    const token = tokenHeader.split(' ')[1];
    
    // 2. Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 3. Verificar el Rol
    if (decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. Requiere rol de Administrador.' });
    }

    // Guardamos los datos del usuario en la petición y continuamos
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

module.exports = verifyAdmin;