<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { createOrder } from '@/api/productService';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

// --- ESTADO DEL MODAL Y FORMULARIO ---
const showPaymentModal = ref(false);
const isProcessing = ref(false);

const paymentForm = ref({
    cardNumber: '',
    cardName: '',
    expiryDate: '', // Formato MM/YY
    cvv: ''
});

const errors = ref({}); // Para guardar errores de validación

// --- FUNCIONES ---

function removeItem(productId) {
    cartStore.removeItem(productId);
}

// 1. Abrir el Modal (Solo si está logueado y hay items)
function openModal() {
    // Validación A: Carrito vacío
    if (cartStore.totalItems === 0) return;

    // Validación B: Usuario no logueado
    if (!authStore.token || !authStore.user) {
        alert('🔒 Para realizar la compra, necesitas iniciar sesión primero.');
        router.push('/login');
        return;
    }
    
    // Si todo está bien, limpiamos errores y abrimos modal
    errors.value = {};
    showPaymentModal.value = true;
}

// 2. Validar Campos de la Tarjeta
function validateForm() {
    errors.value = {};
    let isValid = true;

    // Validar Nombre
    if (!paymentForm.value.cardName.trim()) {
        errors.value.cardName = 'El nombre del titular es obligatorio.';
        isValid = false;
    }

    // Validar Número de Tarjeta (Simulación: 16 dígitos exactos)
    const cardRegex = /^\d{16}$/;
    if (!cardRegex.test(paymentForm.value.cardNumber.replace(/\s/g, ''))) {
        errors.value.cardNumber = 'El número debe tener 16 dígitos numéricos.';
        isValid = false;
    }

    // Validar Fecha (MM/YY)
    const dateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!dateRegex.test(paymentForm.value.expiryDate)) {
        errors.value.expiryDate = 'Formato inválido (MM/YY). Ej: 12/25';
        isValid = false;
    }

    // Validar CVV (3 dígitos)
    const cvvRegex = /^\d{3}$/;
    if (!cvvRegex.test(paymentForm.value.cvv)) {
        errors.value.cvv = 'CVV inválido (3 dígitos).';
        isValid = false;
    }

    return isValid;
}

// 3. Procesar el Pago (Simulación)
async function processPayment() {
    // Primero validamos el formulario
    if (!validateForm()) return;

    isProcessing.value = true;

    // Simulamos espera del banco (2 segundos)
    setTimeout(async () => {
        try {
            // Preparamos los datos para el Backend
            const orderData = {
                total: parseFloat(cartStore.totalPrice),
                items: cartStore.items,
                userId: authStore.user.id
            };

            // Enviamos la orden a la Base de Datos
            const result = await createOrder(orderData);
            
            // Éxito
            showPaymentModal.value = false;
            cartStore.clearCart();
            
            alert(`✅ ¡Pago Aprobado!\nGracias ${authStore.user.name}.\nID de Orden: ${result.orderId}`);
            router.push('/'); 

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.error || 'Hubo un error al procesar tu pedido.';
            alert('❌ ' + msg);
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
                    <input 
                        v-model="paymentForm.cardName" 
                        type="text" 
                        placeholder="Como aparece en la tarjeta" 
                        :class="{ 'input-error': errors.cardName }"
                    />
                    <span v-if="errors.cardName" class="error-msg">{{ errors.cardName }}</span>
                </div>

                <div class="form-group">
                    <label>Número de Tarjeta</label>
                    <input 
                        v-model="paymentForm.cardNumber" 
                        type="text" 
                        placeholder="1234 5678 1234 5678" 
                        maxlength="16"
                        :class="{ 'input-error': errors.cardNumber }"
                    />
                    <span v-if="errors.cardNumber" class="error-msg">{{ errors.cardNumber }}</span>
                </div>

                <div class="row">
                    <div class="form-group half">
                        <label>Vencimiento (MM/YY)</label>
                        <input 
                            v-model="paymentForm.expiryDate" 
                            type="text" 
                            placeholder="MM/YY" 
                            maxlength="5"
                            :class="{ 'input-error': errors.expiryDate }"
                        />
                        <span v-if="errors.expiryDate" class="error-msg">{{ errors.expiryDate }}</span>
                    </div>
                    <div class="form-group half">
                        <label>CVV</label>
                        <input 
                            v-model="paymentForm.cvv" 
                            type="password" 
                            placeholder="123" 
                            maxlength="3"
                            :class="{ 'input-error': errors.cvv }"
                        />
                        <span v-if="errors.cvv" class="error-msg">{{ errors.cvv }}</span>
                    </div>
                </div>

                <div class="modal-buttons">
                    <button type="button" @click="showPaymentModal = false" class="cancel-btn" :disabled="isProcessing">Cancelar</button>
                    <button type="submit" class="pay-btn" :disabled="isProcessing">
                        {{ isProcessing ? 'Procesando...' : 'Pagar Ahora' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos Generales */
.cart-view { padding: 40px; max-width: 1000px; margin: 0 auto; background-color: white; color: #333; min-height: 80vh; }
.empty-cart { text-align: center; padding: 50px; border: 1px dashed #ccc; margin-top: 30px; }
.cart-content { display: flex; gap: 30px; margin-top: 30px; }

/* Estilos Lista Productos */
.cart-items { flex-grow: 1; }
.cart-item { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 15px 0; }
.item-details h3 { margin: 0 0 5px 0; color: #333; }
.item-details p { margin: 2px 0; color: #666; }
.remove-btn { background-color: #dc3545; color: white; border: none; padding: 8px 15px; cursor: pointer; border-radius: 4px; }

/* Estilos Resumen */
.cart-summary { width: 300px; padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9; border-radius: 8px; align-self: flex-start; }
.total-price { font-size: 1.5em; font-weight: bold; color: #28a745; margin-top: 15px; }
.total-price span { float: right; }
.checkout-btn { width: 100%; background-color: #007bff; color: white; padding: 12px; margin-top: 20px; border: none; cursor: pointer; font-size: 1.1em; border-radius: 5px; }
.checkout-btn:hover { background-color: #0056b3; }

/* --- ESTILOS DEL MODAL --- */
.modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex; justify-content: center; align-items: center;
    z-index: 1000;
}
.modal-content {
    background: white; padding: 30px; border-radius: 10px;
    width: 90%; max-width: 450px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.total-to-pay { margin-bottom: 20px; font-size: 1.2em; color: #333; text-align: center; }
.payment-form .form-group { margin-bottom: 15px; }
.payment-form label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 0.9em; color: #555; }
.payment-form input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 1em; }

.input-error { border-color: #dc3545 !important; background-color: #fff8f8; }
.error-msg { color: #dc3545; font-size: 0.8em; margin-top: 5px; display: block; }

.row { display: flex; gap: 15px; }
.half { flex: 1; }

.modal-buttons { display: flex; gap: 10px; margin-top: 25px; }
.pay-btn { flex: 2; background-color: #28a745; color: white; border: none; padding: 12px; border-radius: 5px; cursor: pointer; font-size: 1.1em; font-weight: bold; }
.cancel-btn { flex: 1; background-color: #6c757d; color: white; border: none; padding: 12px; border-radius: 5px; cursor: pointer; }
</style>