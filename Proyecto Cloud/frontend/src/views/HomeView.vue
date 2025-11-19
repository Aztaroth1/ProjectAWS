<script setup>
import { ref, onMounted } from 'vue';
import { getProducts } from '@/api/productService'; // Importamos el servicio
import { useCartStore } from '@/stores/cart'; // <--- NUEVA

// 1. Variables de estado
const products = ref([]); // Lista donde guardaremos los productos
const loading = ref(true); // Para mostrar un spinner de carga
const error = ref(null); // Para mostrar mensajes de error
const cartStore = useCartStore();

// 2. Función de carga de datos
async function fetchProducts() {
  try {
    // Llama a la API y espera la respuesta
    products.value = await getProducts();
  } catch (err) {
    error.value = 'No se pudieron cargar los productos. Error de conexión con la API.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}
function addToCart(product) {
  cartStore.addItem(product, 1);
  alert(`${product.name} añadido al carrito.`);
}

// 3. Hook de ciclo de vida (Se ejecuta cuando el componente se carga)
onMounted(fetchProducts);
</script>

<template>
  <main class="home-view">
    <h1>🛒 Productos disponibles</h1>

    <div v-if="loading" class="loading">Cargando productos...</div>

    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else class="product-list">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img :src="product.image_url" :alt="product.name" class="product-image"/>
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <p class="price">${{ parseFloat(product.price).toFixed(2) }}</p>
        <p class="stock">En Stock: {{ product.stock }}</p>
        <button @click="addToCart(product)">Añadir al Carrito</button>
      </div>
    </div>

    <div v-if="!products.length && !loading && !error">
        No hay productos cargados en la base de datos.
    </div>
  </main>
</template>

<style scoped>
.home-view {
  padding: 20px;
  text-align: center;
}
.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}
.product-card {
  border: 1px solid #ccc;
  padding: 15px;
  width: 300px;
  text-align: left;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}
.product-image {
  width: 100%;
  height: auto;
  min-height: 200px;
  background-color: #f5f5f5;
  object-fit: contain;
}
.price {
  font-weight: bold;
  color: #007bff;
  font-size: 1.2em;
  margin: 10px 0;
}
.stock {
    font-size: 0.9em;
    color: #6c757d;
}
</style>
