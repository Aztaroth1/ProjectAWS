1. Crear la Base de Datos

CREATE DATABASE ecommerce_db;

2. Importar el Esquema y los Datos

# Abre la terminal y navega hasta la carpeta 'Proyecto Cloud'
cd "Proyecto Cloud"

# Ejecuta el comando de importación
# (Asegúrate de cambiar 'tu_usuario_postgres' si no es 'postgres')
psql -U postgres -d ecommerce_db -f database.sql

II. 💻 Configuración del Backend (Node.js/Express)

# Navega a la carpeta del backend
cd "Proyecto Cloud"/backend

# Instala todas las dependencias de Node.js
npm install

2. Crear el Archivo de Entorno (.env)

# Puerto para el servidor backend
PORT=3000

# Configuración de la Base de Datos
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=ecommerce_db
DB_PASSWORD= # O la contraseña que uses localmente para 'postgres'
DB_PORT=5432

3. Ejecutar el Servidor

npm start
# El servidor backend estará corriendo en http://localhost:3000

III. 🎨 Configuración del Frontend (Vue.js)

# Vuelve a la carpeta raíz del proyecto y luego navega al frontend
cd ../frontend

# Instala todas las dependencias de Vue.js
npm install

2. Ejecutar la Aplicación

npm run dev
# La aplicación frontend estará disponible en el puerto que te indique la terminal (típicamente http://localhost:5173 o http://localhost:8080)