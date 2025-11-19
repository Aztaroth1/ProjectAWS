// src/api/productService.js

import axios from 'axios';

// 1. Crear una instancia de Axios con la URL base del backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Apunta a la URL donde Express está sirviendo la API
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Función para obtener todos los productos
export async function getProducts() {
  try {
    const response = await api.get('/products'); // Axios ya agrega '/products' a la baseURL
    return response.data; // Los datos de la respuesta
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error; // Propagar el error para que el componente lo maneje
  }
}

// 3. Función para obtener un producto por ID
export async function getProductById(id) {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener producto ${id}:`, error);
        throw error;
    }
}

// 4. Función para crear una orden de compra
export async function createOrder(orderData) {
  try {
    // orderData debe ser: { total: 100.00, items: [...] }
    const response = await api.post('/orders', orderData);
    return response.data; // Retorna { message: '...', orderId: 1 }
  } catch (error) {
    console.error('Error al crear la orden:', error);
    throw error;
  }
}

// Aquí irán otras funciones (crear, actualizar, eliminar...)