<script setup>
import { useCartStore } from '@/stores/cart';
import { createOrder } from '@/api/productService'; // <--- Importamos la función
import { ref } from 'vue'; // Importamos ref para manejar estados de carga si quisiéramos

const cartStore = useCartStore();

function removeItem(productId) {
    cartStore.removeItem(productId);
}

// Nueva función de Checkout conectada al Backend
async function checkout() {
    // 1. Validar que haya items
    if (cartStore.totalItems === 0) return;

    // 2. Preparar los datos para el backend
    const orderData = {
        total: parseFloat(cartStore.totalPrice),
        items: cartStore.items
    };

    try {
        // 3. Enviar al Backend
        const result = await createOrder(orderData);
        
        // 4. Éxito: Mostrar mensaje y vaciar carrito
        alert(`¡Compra realizada con éxito!\nID de Orden: ${result.orderId}`);
        cartStore.clearCart();
        
    } catch (error) {
        // 5. Error
        alert('Hubo un error al procesar tu pedido. Inténtalo de nuevo.');
    }
}
</script>

<template>
  <div class="cart-view">
    <h1>🛒 Tu Carrito de Compras</h1>
    
    <div v-if="cartStore.totalItems === 0" class="empty-cart">
        <p>Tu carrito está vacío. ¡Añade algunos productos!</p>
        <RouterLink to="/">Ir a la Tienda</RouterLink>
    </div>

    <div v-else class="cart-content">
        <div class="cart-items">
            <div v-for="item in cartStore.items" :key="item.productId" class="cart-item">
                <div class="item-details">
                    <h3>{{ item.name }}</h3>
                    <p>Precio: ${{ item.price.toFixed(2) }}</p>
                    <p>Cantidad: {{ item.quantity }}</p>
                    <p>Subtotal: ${{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
                <button @click="removeItem(item.productId)" class="remove-btn">
                    Eliminar
                </button>
            </div>
        </div>

        <div class="cart-summary">
            <h2>Resumen del Pedido</h2>
            <p>Total de ítems: <span>{{ cartStore.totalItems }}</span></p>
            <p class="total-price">Total a Pagar: <span>${{ cartStore.totalPrice }}</span></p>
            
            <button @click="checkout" class="checkout-btn">
                Proceder al Pago
            </button>
        </div>
    </div>
  </div>
</template>

<style scoped>
.cart-view {
    padding: 40px;
    max-width: 1000px;
    margin: 0 auto;
    background-color: white; 
    color: black;            
    min-height: 80vh;
}
.empty-cart {
    text-align: center;
    padding: 50px;
    border: 1px dashed #ccc;
    margin-top: 30px;
}
.cart-content {
    display: flex;
    gap: 30px;
    margin-top: 30px;
}
.cart-items {
    flex-grow: 1;
}
.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding: 15px 0;
}
.item-details h3 {
    margin: 0;
    color: #333;
}
.remove-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 8px 15px;
    cursor: pointer;
}
.cart-summary {
    width: 300px;
    padding: 20px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    align-self: flex-start; /* Se pega a la parte superior */
}
.total-price {
    font-size: 1.5em;
    font-weight: bold;
    color: #28a745;
    margin-top: 15px;
}
.total-price span {
    float: right;
}
.checkout-btn {
    width: 100%;
    background-color: #007bff;
    color: white;
    padding: 10px;
    margin-top: 20px;
    border: none;
    cursor: pointer;
}
</style>