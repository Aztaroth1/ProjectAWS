<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useProductStore } from '@/stores/products';

const cartStore = useCartStore();
const authStore = useAuthStore();
const productStore = useProductStore();

// Función para el botón "Volver arriba" del footer
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <div class="app-layout">
    
    <header class="main-header">
      <div class="header-container">
        
        <div class="header-left">
          <RouterLink to="/" class="brand-logo">
            <span class="logo-icon">📦</span>
            <span class="logo-text">AS</span>
          </RouterLink>
        </div>

        <div class="header-search">
          <div class="search-wrapper">
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              class="search-input" 
              v-model="productStore.searchQuery"
            />
            <button class="search-btn">🔍</button>
          </div>
        </div>

        <div class="header-right">
          
          <div v-if="authStore.user" class="nav-item user-dropdown">
            <small>Hola, {{ authStore.user.name }}</small>
            <div class="account-text">Cuenta y Listas</div>
            
            <div class="dropdown-content">
              <RouterLink v-if="authStore.user.role === 'admin'" to="/admin">⚙️ Panel Admin</RouterLink>
              <a @click="authStore.logout">Cerrar Sesión</a>
            </div>
          </div>

          <RouterLink v-else to="/login" class="nav-item">
            <small>Hola, identifícate</small>
            <div class="account-text">Cuenta y Listas</div>
          </RouterLink>

          <RouterLink to="/cart" class="nav-item cart-item">
            <div class="cart-icon-wrapper">
              <span class="cart-icon">🛒</span>
              <span class="cart-count">{{ cartStore.totalItems }}</span>
            </div>
            <span class="cart-text">Cesta</span>
          </RouterLink>
        </div>
      </div>
    </header>

    <RouterView />

    <footer class="amazon-footer">
      <div class="back-to-top" @click="scrollToTop">
        Volver arriba
      </div>

      <div class="footer-links-container">
        <div class="footer-col">
          <h3>Conócenos</h3>
          <ul>
            <li><a href="#">Sobre AS</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Gana dinero con nosotros</h3>
          <ul>
            <li><a href="#">Programa de afiliados</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Métodos de pago</h3>
          <ul>
            <li><a href="#">Tarjetas de crédito</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-logo">
           <span class="logo-icon">📦</span> AS
        </div>
        <div class="footer-legal">
          <ul>
            <li><a href="#">Condiciones de Uso</a></li>
            <li><a href="#">Aviso de Privacidad</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
          <p>© 1996-2024, as.com, Inc. o sus afiliados</p>
        </div>
      </div>
    </footer>

  </div>
</template>

<style>
/* Reset Global */
body {
  margin: 0;
  font-family: 'Amazon Ember', Arial, sans-serif;
  background-color: #E3E6E6;
  color: #0F1111;
}
</style>

<style scoped>
/* --- HEADER PRINCIPAL (STICKY) --- */
.main-header {
  background-color: #131921;
  color: white;
  /* ESTAS 3 LÍNEAS HACEN QUE SE PEGUE AL BAJAR */
  position: sticky;
  top: 0;
  z-index: 2000; /* Alto z-index para estar encima del carrusel */
  width: 100%;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.header-container {
  display: flex;
  align-items: center;
  height: 60px;
  width: 100%;
  max-width: none;
  padding: 0 20px;
  box-sizing: border-box;
  gap: 20px;
  justify-content: space-between;
}

/* LOGO */
.header-left { flex-shrink: 0; }

.brand-logo {
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border: 1px solid transparent;
  border-radius: 2px;
}
.brand-logo:hover { border-color: white; }
.logo-text { font-size: 1.4em; font-weight: bold; margin-left: 5px; white-space: nowrap; }

/* BUSCADOR */
.header-search {
  flex-grow: 1;
  min-width: 200px;
}
.search-wrapper {
  display: flex;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
}
.search-input {
  flex-grow: 1;
  border: none;
  padding: 0 10px;
  font-size: 1em;
  width: 100%;
}
.search-input:focus { outline: none; }
.search-btn {
  background-color: #febd69;
  border: none;
  width: 45px;
  cursor: pointer;
  font-size: 1.2em;
  transition: background 0.2s;
}
.search-btn:hover { background-color: #f3a847; }

/* NAVEGACIÓN DERECHA */
.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
}
.nav-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  text-decoration: none;
  padding: 5px 9px;
  border: 1px solid transparent;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
}
.nav-item:hover { border-color: white; }

.nav-item small { font-size: 0.75em; color: #ccc; line-height: 1; }
.account-text { font-size: 0.85em; font-weight: bold; line-height: 1.1; }

/* CARRITO */
.cart-item {
  flex-direction: row;
  align-items: flex-end;
  gap: 2px;
}
.cart-icon-wrapper { position: relative; }
.cart-icon { font-size: 2em; line-height: 1; }
.cart-count {
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  color: #f08804;
  font-weight: bold;
  font-size: 1em;
}
.cart-text { font-weight: bold; font-size: 0.9em; margin-bottom: 5px; }

/* DROPDOWN */
.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  min-width: 150px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  z-index: 1001;
  border-radius: 3px;
  overflow: hidden;
}
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  font-size: 0.9em;
}
.dropdown-content a:hover { background-color: #f1f1f1; }
.user-dropdown:hover .dropdown-content { display: block; }

/* --- SUB HEADER --- */
.sub-header {
  background-color: #232f3e;
  height: 39px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  min-width: 1000px;
  border-top: 1px solid rgba(255,255,255,0.1);
}
.sub-header-content a {
  color: white;
  text-decoration: none;
  font-size: 0.9em;
  margin-right: 20px;
  padding: 5px 8px;
  border: 1px solid transparent;
  border-radius: 2px;
  white-space: nowrap;
}
.sub-header-content a:hover { border-color: white; }

/* --- FOOTER TIPO AMAZON --- */
.amazon-footer {
  margin-top: 50px;
  background-color: #131921;
  color: white;
  font-size: 0.9em;
}

/* Botón Volver Arriba */
.back-to-top {
  background-color: #37475A;
  color: white;
  text-align: center;
  padding: 15px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
}
.back-to-top:hover {
  background-color: #485769;
}

/* Contenedor de Enlaces */
.footer-links-container {
  background-color: #232F3E;
  display: flex;
  justify-content: center;
  padding: 40px 10%;
  gap: 60px;
  border-bottom: 1px solid #3a4553;
  flex-wrap: wrap; 
}

.footer-col h3 {
  font-size: 1em;
  font-weight: 700;
  margin-bottom: 15px;
  color: white;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-col ul li { margin-bottom: 10px; }

.footer-col ul li a {
  color: #DDD;
  text-decoration: none;
  font-size: 0.85em;
}
.footer-col ul li a:hover { text-decoration: underline; }

/* Footer Inferior */
.footer-bottom {
  background-color: #131921;
  padding: 30px 0;
  text-align: center;
}

.footer-logo {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.footer-legal ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 10px;
}

.footer-legal ul li a {
  color: #DDD;
  text-decoration: none;
  font-size: 0.8em;
}

.footer-legal ul li a:hover { text-decoration: underline; }

.footer-legal p {
  font-size: 0.75em;
  color: #DDD;
  margin-top: 10px;
}
</style>