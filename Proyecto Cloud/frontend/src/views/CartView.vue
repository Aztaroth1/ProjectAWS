<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { createOrder } from '@/api/productService';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const showPaymentModal = ref(false);
const isProcessing = ref(false);

const paymentForm = ref({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
});

const errors = ref({});

// --- FUNCIONES ---

function removeItem(productId) {
    cartStore.removeItem(productId);
}

// NUEVA: Helper para imágenes
function getImageUrl(imagePath) {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000/${imagePath.replace(/\\/g, '/')}`;
}

function openModal() {
    if (cartStore.totalItems === 0) return;
    if (!authStore.token || !authStore.user) {
        toast.error('🔒 Inicia sesión para comprar');
        router.push('/login');
        return;
    }
    errors.value = {};
    showPaymentModal.value = true;
}

function validateForm() {
    errors.value = {};
    let isValid = true;

    if (!paymentForm.value.cardName.trim()) {
        errors.value.cardName = 'El nombre del titular es obligatorio.';
        isValid = false;
    }
    if (!/^\d{16}$/.test(paymentForm.value.cardNumber.replace(/\s/g, ''))) {
        errors.value.cardNumber = 'El número debe tener 16 dígitos numéricos.';
        isValid = false;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentForm.value.expiryDate)) {
        errors.value.expiryDate = 'Formato inválido (MM/YY). Ej: 12/25';
        isValid = false;
    }
    if (!/^\d{3}$/.test(paymentForm.value.cvv)) {
        errors.value.cvv = 'CVV inválido (3 dígitos).';
        isValid = false;
    }
    return isValid;
}

async function processPayment() {
    if (!validateForm()) {
        toast.warning('Por favor revisa los campos del formulario'); // ADVERTENCIA AMARILLA
        return;
    }
    isProcessing.value = true;

    setTimeout(async () => {
        try {
            const orderData = {
                total: parseFloat(cartStore.totalPrice),
                items: cartStore.items,
                userId: authStore.user.id
            };
            const result = await createOrder(orderData);
            showPaymentModal.value = false;
            cartStore.clearCart();
            toast.success(`✅ ¡Pago Aprobado!\nGracias ${authStore.user.name}.\nID de Orden: ${result.orderId}`);
            router.push('/'); 
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.error || 'Hubo un error al procesar tu pedido.';
            toast.error('❌ ' + msg);
        } finally {
            isProcessing.value = false;
        }
    }, 2000);
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
                
                <div class="cart-item-image">
                    <img :src="getImageUrl(item.image_url)" :alt="item.name" />
                </div>

                <div class="item-details">
                    <h3>{{ item.name }}</h3>
                    <p>Precio: ${{ item.price.toFixed(2) }}</p>
                    <p>Cantidad: {{ item.quantity }}</p>
                    <p>Subtotal: <strong>${{ (item.price * item.quantity).toFixed(2) }}</strong></p>
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
            
            <button @click="openModal" class="checkout-btn">
                Proceder al Pago
            </button>
        </div>
    </div>

    <div v-if="showPaymentModal" class="modal-overlay">
        <div class="modal-content">
            <h2>💳 Datos de Pago</h2>
            <p class="total-to-pay">Monto a debitar: <strong>${{ cartStore.totalPrice }}</strong></p>

            <form @submit.prevent="processPayment" class="payment-form">
                <div class="form-group">
                    <label>Titular de la Tarjeta</label>
                    <input v-model="paymentForm.cardName" type="text" placeholder="Como aparece en la tarjeta" :class="{ 'input-error': errors.cardName }" />
                    <span v-if="errors.cardName" class="error-msg">{{ errors.cardName }}</span>
                </div>
                <div class="form-group">
                    <label>Número de Tarjeta</label>
                    <input v-model="paymentForm.cardNumber" type="text" placeholder="1234 5678 1234 5678" maxlength="16" :class="{ 'input-error': errors.cardNumber }" />
                    <span v-if="errors.cardNumber" class="error-msg">{{ errors.cardNumber }}</span>
                </div>
                <div class="row">
                    <div class="form-group half">
                        <label>Vencimiento (MM/YY)</label>
                        <input v-model="paymentForm.expiryDate" type="text" placeholder="MM/YY" maxlength="5" :class="{ 'input-error': errors.expiryDate }" />
                        <span v-if="errors.expiryDate" class="error-msg">{{ errors.expiryDate }}</span>
                    </div>
                    <div class="form-group half">
                        <label>CVV</label>
                        <input v-model="paymentForm.cvv" type="password" placeholder="123" maxlength="3" :class="{ 'input-error': errors.cvv }" />
                        <span v-if="errors.cvv" class="error-msg">{{ errors.cvv }}</span>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button type="button" @click="showPaymentModal = false" class="cancel-btn" :disabled="isProcessing">Cancelar</button>
                    <button type="submit" class="pay-btn" :disabled="isProcessing">{{ isProcessing ? 'Procesando...' : 'Pagar Ahora' }}</button>
                </div>
            </form>
        </div>
    </div>
  </div>
</template>

<style scoped>
.cart-view { padding: 40px; max-width: 1000px; margin: 0 auto; background-color: white; color: #333; min-height: 80vh; }
.empty-cart { text-align: center; padding: 50px; border: 1px dashed #ccc; margin-top: 30px; }
.cart-content { display: flex; gap: 30px; margin-top: 30px; }
.cart-items { flex-grow: 1; }

/* ESTILOS ITEM (Modificados para imagen) */
.cart-item { display: flex; align-items: flex-start; border-bottom: 1px solid #eee; padding: 20px 0; gap: 20px; }

.cart-item-image {
    width: 100px;
    height: 100px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9f9f9;
    border-radius: 4px;
}
.cart-item-image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.item-details { flex-grow: 1; }
.item-details h3 { margin: 0 0 5px 0; color: #007185; font-size: 1.2em; } /* Título azul Amazon */
.item-details p { margin: 2px 0; color: #565959; font-size: 0.9em; }

.remove-btn { background: none; color: #007185; border: none; padding: 0; cursor: pointer; font-size: 0.9em; text-decoration: underline; align-self: center; }
.remove-btn:hover { color: #c7511f; }

/* ESTILOS RESUMEN Y MODAL (Iguales) */
.cart-summary { width: 300px; padding: 20px; border: 1px solid #ddd; background-color: #f3f3f3; border-radius: 8px; align-self: flex-start; }
.total-price { font-size: 1.5em; font-weight: bold; color: #B12704; margin-top: 15px; } /* Precio rojo Amazon */
.checkout-btn { width: 100%; background-color: #ffd814; color: #0F1111; padding: 10px; margin-top: 20px; border: none; cursor: pointer; font-size: 1em; border-radius: 8px; box-shadow: 0 2px 5px rgba(213,217,217,0.5); }
.checkout-btn:hover { background-color: #f7ca00; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 3000; }
.modal-content { background: white; padding: 30px; border-radius: 10px; width: 90%; max-width: 450px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
.total-to-pay { margin-bottom: 20px; font-size: 1.2em; color: #333; text-align: center; }
.payment-form .form-group { margin-bottom: 15px; }
.payment-form label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 0.9em; color: #555; }
.payment-form input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 1em; box-sizing: border-box; }
.input-error { border-color: #dc3545 !important; background-color: #fff8f8; }
.error-msg { color: #dc3545; font-size: 0.8em; margin-top: 5px; display: block; }
.row { display: flex; gap: 15px; } .half { flex: 1; }
.modal-buttons { display: flex; gap: 10px; margin-top: 25px; }
.pay-btn { flex: 2; background-color: #ffd814; color: #0F1111; border: none; padding: 12px; border-radius: 5px; cursor: pointer; font-size: 1.1em; font-weight: bold; }
.cancel-btn { flex: 1; background-color: white; color: #0F1111; border: 1px solid #D5D9D9; padding: 12px; border-radius: 5px; cursor: pointer; box-shadow: 0 2px 5px rgba(213,217,217,0.5); }
</style>