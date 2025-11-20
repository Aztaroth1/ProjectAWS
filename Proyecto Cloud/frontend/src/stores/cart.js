// src/stores/cart.js

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  // Estado (State): Almacena los datos del carrito
  const items = ref([]); // Ejemplo de un ítem: { productId: 1, name: 'Laptop', price: 1200.50, quantity: 1 }

  // Getters (Computed): Funciones que calculan datos basados en el estado
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  });

  // Acciones (Actions): Lógica para modificar el estado
  function addItem(product, quantity = 1) {
    const existingItem = items.value.find(item => item.productId === product.id);

    if (existingItem) {
      // Si el producto ya está, solo aumenta la cantidad
      existingItem.quantity += quantity;
    } else {
      // Si es nuevo, añade un nuevo ítem al carrito
      items.value.push({
        productId: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity: quantity,
        image_url: product.image_url
      });
    }
  }

  function removeItem(productId) {
    items.value = items.value.filter(item => item.productId !== productId);
  }

  function clearCart() {
    items.value = [];
  }

  return { items, totalItems, totalPrice, addItem, removeItem, clearCart };
});