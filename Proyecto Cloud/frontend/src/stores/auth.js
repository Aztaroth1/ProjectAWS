// frontend/src/stores/auth.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { loginUser, registerUser } from '@/api/authService';

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const token = ref(localStorage.getItem('token') || null);

  // Acciones
  async function login(email, password) {
    try {
      const data = await loginUser({ email, password });
      
      // Guardar en estado y en LocalStorage
      token.value = data.token;
      user.value = data.user;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return true; // Éxito
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function register(email, password, fullName) {
    await registerUser({ email, password, fullName });
    // Después de registrarse, hacemos login automático o pedimos login
    return true;
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Opcional: recargar página o redirigir
    window.location.href = '/';
  }

  return { user, token, login, register, logout };
});