<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useCartStore } from '@/stores/cart'; // Importamos el Store

const cartStore = useCartStore(); // Inicializamos el Store
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="main-nav">
        <RouterLink to="/">Inicio</RouterLink>
        
        <RouterLink to="/cart" class="cart-link">
          🛒 Carrito ({{ cartStore.totalItems }})
        </RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
/* Asegúrate de que los estilos existan o se añadan */
header {
  line-height: 1.5;
  max-height: 100vh;
  padding: 1rem 0;
  background-color: #f8f8f8;
  border-bottom: 1px solid #eee;
}

.main-nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  margin-top: 1rem;
}

.main-nav a {
  display: inline-block;
  padding: 0 1rem;
  text-decoration: none;
  font-weight: 500;
}

.cart-link {
    font-weight: bold;
    color: #007bff;
    border-left: 1px solid var(--color-border, #ccc); /* Separador opcional */
}
</style>