<script setup>
import { onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useProductStore } from '@/stores/products'; // <--- 1. Importar el Store de Productos

const cartStore = useCartStore();
const productStore = useProductStore(); // <--- 2. Inicializar

function getImageUrl(imagePath) {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000/${imagePath.replace(/\\/g, '/')}`;
}

// 3. En lugar de fetch local, usamos la acción del store
onMounted(() => {
    productStore.fetchAllProducts();
});

function addToCart(product) {
  cartStore.addItem(product, 1);
  alert(`${product.name} añadido a la cesta.`);
}
</script>

<template>
  <main class="amazon-home">
    
    <div class="hero-banner">
      <div class="hero-content">
        <h2>Bienvenido a la tienda de Stiven</h2>
        <p>Las mejores ofertas en tecnología</p>
      </div>
    </div>

    <div class="main-content">
      
      <div v-if="productStore.loading" class="loading">Cargando ofertas...</div>
      <div v-if="productStore.error" class="error">{{ productStore.error }}</div>

      <div v-else class="product-grid">
        
        <div v-if="productStore.filteredProducts.length === 0" class="no-results">
            <p>No se encontraron productos que coincidan con tu búsqueda.</p>
        </div>

        <div v-for="product in productStore.filteredProducts" :key="product.id" class="product-card">
          
          <div class="image-container">
            <img :src="getImageUrl(product.image_url)" :alt="product.name" />
          </div>

          <div class="card-info">
            <h3 class="product-title">{{ product.name }}</h3>
            
            <div class="rating">
              ⭐⭐⭐⭐☆ <span class="rating-count">1,204</span>
            </div>

            <div class="price-block">
              <span class="currency">$</span>
              <span class="price-whole">{{ Math.floor(product.price) }}</span>
              <span class="price-fraction">{{ (product.price % 1).toFixed(2).substring(2) }}</span>
            </div>

            <p class="delivery-info">Entrega GRATIS en tu primer pedido</p>
            <p v-if="product.stock < 5" class="stock-warning">Solo quedan {{ product.stock }} en stock</p>

            <button 
                @click="addToCart(product)" 
                :disabled="product.stock === 0"
                class="amz-btn">
                {{ product.stock === 0 ? 'No disponible' : 'Añadir a la cesta' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.amazon-home {
  background-color: #E3E6E6;
  min-height: 100vh;
  padding-bottom: 50px;
  overflow-x: hidden; /* Evita scroll horizontal no deseado */
}

/* BANNER */
.hero-banner {
  background: linear-gradient(to bottom, #232f3e, #E3E6E6);
  min-height: 350px; /* Un poco más alto */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 80px;
}
.hero-content {
  color: white;
  text-align: center;
  z-index: 1;
}
.hero-content h2 { font-size: 2.5em; margin: 0 0 10px 0; }
.hero-content p { font-size: 1.2em; margin: 0; }

/* CONTENIDO PRINCIPAL */
.main-content {
  width: 100%; 
  max-width: 100%; /* ANTES era 1400px, ahora dejamos que se expanda */
  margin: -250px auto 0; /* Subimos más el contenido sobre el banner */
  padding: 0 40px; /* Margen a los lados para que no pegue al borde */
  position: relative;
  z-index: 10;
  box-sizing: border-box;
}

/* GRID RESPONSIVO */
/* GRID DE PRODUCTOS */
.product-grid {
  display: grid;
  /* Esto crea tantas columnas como quepan. Mínimo 300px por tarjeta. */
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
  gap: 25px; /* Espacio entre tarjetas */
  width: 100%;
}

/* TARJETA */
.product-card {
  background-color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  min-height: 450px; /* Tarjetas un poco más altas */
  border: 1px solid #eee;
  box-sizing: border-box;
}

/* IMAGEN - Ajustada para que no se deforme */
.image-container {
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  background-color: #fff;
}
.image-container img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain; /* Mantiene proporción sin cortar */
}

/* TEXTOS */
.card-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-title {
  font-size: 1.1em;
  line-height: 1.4;
  color: #0F1111;
  font-weight: 400; 
  margin-bottom: 10px;
  /* Limitar a 2 líneas para uniformidad */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.product-title:hover { color: #c7511f; cursor: pointer; }

/* RATING */
.rating { font-size: 0.9em; margin-bottom: 10px; }
.rating-count { color: #007185; margin-left: 5px; }

/* PRECIO */
.price-block {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}
.currency { font-size: 0.8em; margin-top: 5px; }
.price-whole { font-size: 1.8em; font-weight: 500; }
.price-fraction { font-size: 0.8em; margin-top: 5px; }

/* INFO EXTRA */
.delivery-info { font-size: 0.85em; color: #565959; margin-bottom: 5px; }
.stock-warning { color: #B12704; font-size: 0.85em; font-weight: bold; margin-bottom: 15px; }

/* BOTÓN */
.amz-btn {
  background-color: #007185; /* Tu azul */
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 0.9em;
  cursor: pointer;
  width: 100%;
  margin-top: auto; /* Empuja el botón al fondo de la tarjeta */
  transition: background 0.2s;
}
.amz-btn:hover {
  background-color: #005a6a;
}
.amz-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
/* Mensaje de no resultados */
.no-results {
    grid-column: 1 / -1;
    text-align: center;
    background: white;
    padding: 40px;
    font-size: 1.2em;
    color: #555;
}
</style>