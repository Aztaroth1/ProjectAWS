<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useProductStore } from '@/stores/products';
import { useToast } from "vue-toastification"; 
const cartStore = useCartStore();
const productStore = useProductStore();
const toast = useToast();
// --- LÓGICA DEL CARRUSEL ---
const currentSlide = ref(0);
const timer = ref(null);

// Imágenes de prueba (Simulando banners de Amazon)
const slides = [
  { id: 1, color: '#232f3e', text: 'Nuevos Lanzamientos en Gaming', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80' },
  { id: 2, color: '#37475A', text: 'Ofertas en Casa Inteligente', img: 'https://i.ytimg.com/vi/8zSrkxLLtl8/maxresdefault.jpg' },
  { id: 3, color: '#131921', text: 'Envío GRATIS en tu primera compra', img: 'https://www.apple.com/newsroom/images/2025/09/apple-debuts-iphone-17/geo/tile/Apple-iPhone-17-hero-250909-lp.jpg.og.jpg?202510021458' },
  { id: 4, color: '#007185', text: 'Descubre la moda de verano', img: 'https://marketingreport.one/Article%20Images/Key%20Industy%20Images/YouLaunch_Lenovo_marketing_report_one.jpg' }
];

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

const startAutoPlay = () => {
  timer.value = setInterval(nextSlide, 2500); // Cambia cada 5 segundos
};

const stopAutoPlay = () => {
  clearInterval(timer.value);
};

// --- RESTO DE LA LÓGICA ---
function getImageUrl(imagePath) {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000/${imagePath.replace(/\\/g, '/')}`;
}

onMounted(() => {
    productStore.fetchAllProducts();
    startAutoPlay();
});

onUnmounted(() => {
    stopAutoPlay();
});

function addToCart(product) {
  cartStore.addItem(product, 1);
  toast.success(`${product.name} añadido a la cesta`, {
    timeout: 2000
  });
}
</script>

<template>
  <main class="amazon-home">
    
    <div class="carousel-container" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
      
      <button class="carousel-btn prev" @click="prevSlide">❮</button>
      <button class="carousel-btn next" @click="nextSlide">❯</button>

      <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="slide in slides" :key="slide.id" class="carousel-slide">
            <div class="slide-content" :style="{ backgroundImage: `linear-gradient(to top, #E3E6E6 0%, transparent 50%), url(${slide.img})` }">
                </div>
        </div>
      </div>
      
      <div class="carousel-fade-bottom"></div>
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
            <RouterLink :to="{ name: 'product-detail', params: { id: product.id } }">
                <img :src="getImageUrl(product.image_url)" :alt="product.name" />
            </RouterLink>
          </div>

          <div class="card-info">
            <RouterLink :to="{ name: 'product-detail', params: { id: product.id } }" class="title-link">
                <h3 class="product-title">{{ product.name }}</h3>
            </RouterLink>
            
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
  overflow-x: hidden;
}

/* --- ESTILOS DEL CARRUSEL --- */
.carousel-container {
  position: relative;
  width: 100%;
  height: 600px; /* Altura del banner grande */
  overflow: hidden;
  margin-bottom: -300px; /* CLAVE: Hace que el contenido de abajo suba sobre el carrusel */
  z-index: 1;
}

.carousel-track {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
}

.slide-content {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center top; /* Alineación tipo Amazon */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 100px;
}

/* Flechas de Navegación */
.carousel-btn {
  position: absolute;
  top: 30%; /* Ajustado para que no queden muy abajo */
  transform: translateY(-50%);
  background-color: transparent;
  color: white;
  border: 2px solid transparent;
  font-size: 3em;
  cursor: pointer;
  z-index: 10;
  padding: 20px 10px;
  height: 250px; /* Área de clic grande */
  display: flex;
  align-items: center;
  transition: border 0.3s;
}

.carousel-btn:hover {
  border: 1px solid white; /* Borde blanco al pasar mouse, estilo Amazon */
  background-color: rgba(0,0,0,0.1);
}

.carousel-btn.prev { left: 0; }
.carousel-btn.next { right: 0; }

/* Efecto de desvanecimiento inferior */
.carousel-fade-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 300px; /* La mitad inferior se desvanece */
  background: linear-gradient(to bottom, transparent, #E3E6E6);
  pointer-events: none; /* Permite hacer clic a través del gradiente */
}

/* --- CONTENIDO PRINCIPAL --- */
.main-content {
  width: 100%; 
  max-width: 100%;
  padding: 0 20px;
  position: relative;
  z-index: 10; /* Encima del carrusel */
  box-sizing: border-box;
}

/* GRID DE PRODUCTOS */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
  gap: 20px;
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
  min-height: 420px;
  box-sizing: border-box;
  z-index: 20;
}

/* IMAGEN */
.image-container {
  height: 200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  background-color: #fff;
}
.image-container img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
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
  margin-bottom: 5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.product-title:hover { color: #c7511f; cursor: pointer; }

/* RATING */
.rating { font-size: 0.9em; margin-bottom: 5px; }
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
.stock-warning { color: #B12704; font-size: 0.85em; font-weight: bold; margin-bottom: 10px; }

/* BOTÓN */
.amz-btn {
  background-color: #ffd814; /* Amarillo Amazon para el botón */
  color: #0F1111;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 0.9em;
  cursor: pointer;
  width: 100%;
  margin-top: auto;
  transition: background 0.2s;
  box-shadow: 0 2px 5px rgba(213, 217, 217, 0.5);
}
.amz-btn:hover {
  background-color: #f7ca00;
}
.amz-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.no-results {
    grid-column: 1 / -1;
    text-align: center;
    background: white;
    padding: 40px;
    font-size: 1.2em;
    color: #555;
    z-index: 20;
}
/* Agrega esto al final de tus estilos */
.title-link {
    text-decoration: none;
    color: inherit;
}

.title-link:hover .product-title {
    color: #c7511f; /* Color naranja de enlace Amazon */
    text-decoration: underline;
}
</style>