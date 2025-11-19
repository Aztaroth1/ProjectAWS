// frontend/src/api/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

// 1. Registrar usuario
export async function registerUser(userData) {
  try {
    // userData debe ser: { email, password, fullName }
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data.error || 'Error al registrarse';
  }
}

// 2. Iniciar Sesión
export async function loginUser(credentials) {
  try {
    // credentials debe ser: { email, password }
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data; // Retorna { token, user }
  } catch (error) {
    throw error.response.data.error || 'Error al iniciar sesión';
  }
}