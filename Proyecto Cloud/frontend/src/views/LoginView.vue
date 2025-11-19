<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// Estado del formulario
const isLogin = ref(true); // true = Login, false = Registro
const email = ref('');
const password = ref('');
const fullName = ref('');
const errorMessage = ref('');

async function handleSubmit() {
  errorMessage.value = '';
  
  try {
    if (isLogin.value) {
      // Lógica de Login
      await authStore.login(email.value, password.value);
      alert('¡Bienvenido de nuevo!');
      router.push('/cart'); // Redirigir al carrito para pagar
    } else {
      // Lógica de Registro
      await authStore.register(email.value, password.value, fullName.value);
      alert('Cuenta creada con éxito. Ahora inicia sesión.');
      isLogin.value = true; // Cambiar a pestaña de login
    }
  } catch (error) {
    errorMessage.value = error;
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>{{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}</h1>
      
      <div class="tabs">
        <button :class="{ active: isLogin }" @click="isLogin = true">Login</button>
        <button :class="{ active: !isLogin }" @click="isLogin = false">Registro</button>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="!isLogin" class="form-group">
          <label>Nombre Completo</label>
          <input v-model="fullName" type="text" required placeholder="Tu nombre" />
        </div>

        <div class="form-group">
          <label>Correo Electrónico</label>
          <input v-model="email" type="email" required placeholder="correo@ejemplo.com" />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="password" type="password" required placeholder="******" />
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <button type="submit" class="submit-btn">
          {{ isLogin ? 'Entrar' : 'Registrarse' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  padding-top: 50px;
}
.auth-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  color: black; /* Aseguramos texto negro */
}
.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}
.tabs button {
  flex: 1;
  padding: 10px;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: bold;
  color: #666;
}
.tabs button.active {
  color: #007bff;
  border-bottom: 2px solid #007bff;
}
.form-group {
  margin-bottom: 15px;
  text-align: left;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.9em;
  color: #333;
}
.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  margin-top: 10px;
}
.submit-btn:hover {
  background-color: #0056b3;
}
.error {
  color: red;
  margin-bottom: 10px;
  font-size: 0.9em;
}
</style>