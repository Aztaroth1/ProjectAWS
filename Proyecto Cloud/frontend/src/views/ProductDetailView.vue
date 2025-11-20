<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getProductById } from '@/api/productService';
import { useCartStore } from '@/stores/cart';
import { useToast } from "vue-toastification";

const route = useRoute();
const cartStore = useCartStore();
const toast = useToast();

const product = ref(null);
const loading = ref(true);
const error = ref(null);

// 1. NUEVA VARIABLE: Para guardar la cantidad seleccionada (por defecto 1)
const selectedQuantity = ref(1); 

function getImageUrl(imagePath) {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000/${imagePath.replace(/\\/g, '/')}`;
}

onMounted(async () => {
    try {
        const id = route.params.id;
        product.value = await getProductById(id);
    } catch (err) {
        error.value = 'No se pudo cargar la información del producto.';
    } finally {
        loading.value = false;
    }
});

function addToCart() {
    if (product.value) {
        // 3. CORRECCIÓN: Usamos selectedQuantity.value en lugar de un 1 fijo
        // Usamos parseInt para asegurar que sea un número y no texto
        cartStore.addItem(product.value, parseInt(selectedQuantity.value));
        
        toast.success(`Agregado: ${selectedQuantity.value}x ${product.value.name}`);
    }
}
</script>

<template>
  <div class="detail-container">
    
    <div v-if="loading" class="loading">Cargando...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else-if="product" class="product-detail-layout">
        
        <div class="image-section">
            <img :src="getImageUrl(product.image_url)" :alt="product.name" />
        </div>

        <div class="info-section">
            <h1 class="title">{{ product.name }}</h1>
            <div class="rating">⭐⭐⭐⭐☆ <span class="rating-count">1,204 valoraciones</span></div>
            <hr class="divider">
            <p class="price-row">
                <span class="price-symbol">$</span>
                <span class="price-whole">{{ Math.floor(product.price) }}</span>
                <span class="price-fraction">{{ (product.price % 1).toFixed(2).substring(2) }}</span>
            </p>
            <p class="vat-info">Los precios incluyen IVA.</p>
            
            <div class="about-item">
                <h3>Sobre este artículo</h3>
                <p class="description">{{ product.description }}</p>
            </div>
        </div>

        <div class="buy-box">
            <p class="price-box">${{ parseFloat(product.price).toFixed(2) }}</p>
            <p class="delivery">Entrega GRATIS el <strong>Lunes, 25 de Nov</strong></p>
            <p class="stock-status" :class="{ 'out-stock': product.stock === 0 }">
                {{ product.stock > 0 ? 'En Stock' : 'Temporalmente agotado' }}
            </p>
            
            <div class="quantity-selector" v-if="product.stock > 0">
                <label>Cantidad:</label>
                <select v-model="selectedQuantity">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>

            <button 
                @click="addToCart" 
                :disabled="product.stock === 0"
                class="add-cart-btn">
                Añadir a la cesta
            </button>
            <p class="secure-trans">🔒 Transacción segura</p>
            <p class="seller-info">Enviado por <span>Amazon</span></p>
            <p class="seller-info">Vendido por <span>MiShop</span></p>
        </div>

    </div>
  </div>
</template>

<style scoped>
/* ... (TUS ESTILOS SE QUEDAN IGUAL QUE ANTES) ... */
.detail-container {
    max-width: 1500px;
    margin: 0 auto;
    padding: 20px;
    background-color: white;
    min-height: 80vh;
}

.product-detail-layout {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;
    align-items: flex-start;
}

.image-section {
    flex: 1;
    min-width: 280px;
    max-width: 450px;
    display: flex;
    justify-content: center;
    padding-top: 20px;
}
.image-section img {
    max-width: 100%;
    max-height: 500px;
    object-fit: contain;
}

.info-section {
    flex: 1;
    min-width: 300px;
    max-width: 600px;
}

.buy-box {
    width: 244px;
    flex-shrink: 0;
    border: 1px solid #d5d9d9;
    border-radius: 8px;
    padding: 18px;
    background-color: white;
    height: fit-content;
}

.title { font-size: 1.6em; font-weight: 500; color: #0F1111; line-height: 1.3; margin-bottom: 5px; }
.rating { font-size: 0.9em; color: #007185; margin-bottom: 10px; }
.rating-count { margin-left: 5px; }
.divider { border: 0; border-top: 1px solid #e7e7e7; margin: 10px 0; }

.price-row { display: flex; align-items: flex-start; color: #0F1111; }
.price-symbol { font-size: 0.8em; margin-top: 5px; }
.price-whole { font-size: 1.8em; font-weight: 500; }
.price-fraction { font-size: 0.8em; margin-top: 5px; }
.vat-info { font-size: 0.85em; color: #565959; margin-top: 0; margin-bottom: 15px; }

.about-item h3 { font-size: 1em; font-weight: 700; margin-bottom: 5px; }
.description { font-size: 0.95em; line-height: 1.5; color: #333; }

.price-box { font-size: 1.3em; font-weight: 700; color: #B12704; margin-bottom: 10px; }
.delivery { font-size: 0.9em; margin-bottom: 15px; }
.stock-status { font-size: 1.1em; color: #007600; font-weight: 500; margin-bottom: 15px; }
.stock-status.out-stock { color: #B12704; }

/* Estilo para el selector de cantidad */
.quantity-selector { margin-bottom: 15px; }
.quantity-selector label { font-size: 0.85em; margin-right: 5px; }
.quantity-selector select {
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background: #f0f2f2;
    box-shadow: 0 2px 5px rgba(15,17,17,.15);
}

.add-cart-btn {
    width: 100%;
    background-color: #ffd814;
    border: none;
    padding: 8px;
    border-radius: 20px;
    cursor: pointer;
    margin-bottom: 10px;
    font-size: 0.9em;
    box-shadow: 0 2px 5px rgba(213,217,217,0.5);
}
.add-cart-btn:hover { background-color: #f7ca00; }

.buy-now-btn {
    width: 100%;
    background-color: #ffa41c;
    border: none;
    padding: 8px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.9em;
    margin-bottom: 15px;
    box-shadow: 0 2px 5px rgba(213,217,217,0.5);
}
.buy-now-btn:hover { background-color: #fa8900; }

.secure-trans { font-size: 0.85em; color: #007185; margin-bottom: 10px; }
.seller-info { font-size: 0.8em; margin: 3px 0; color: #565959; }
.seller-info span { color: #007185; }

@media (max-width: 950px) {
    .product-detail-layout { 
        flex-direction: column; 
        align-items: center;
    }
    .image-section, .info-section, .buy-box {
        width: 100%;
        max-width: 100%;
        min-width: auto;
    }
    .buy-box { order: 3; }
}
</style>