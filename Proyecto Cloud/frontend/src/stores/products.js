// frontend/src/stores/products.js
import { defineStore } from 'pinia';
import { getProducts } from '@/api/productService';

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],      // Todos los productos
    loading: false,
    error: null,
    searchQuery: ''    // <--- Aquí guardamos lo que escribes en el buscador
  }),

  getters: {
    // Este "getter" filtra la lista automáticamente basado en el texto
    filteredProducts: (state) => {
      if (!state.searchQuery) return state.products;
      
      const lowerQuery = state.searchQuery.toLowerCase();
      
      return state.products.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) || 
        product.description.toLowerCase().includes(lowerQuery)
      );
    }
  },

  actions: {
    async fetchAllProducts() {
      this.loading = true;
      this.error = null;
      try {
        this.products = await getProducts();
      } catch (err) {
        this.error = 'Error al cargar productos';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    
    setSearchQuery(query) {
        this.searchQuery = query;
    }
  }
});