import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CartView from '../views/CartView.vue'; // <--- NUEVA IMPORTACIÓN
import LoginView from '../views/LoginView.vue'; // <--- NUEVA IMPORTACIÓN
import AdminView from '../views/AdminView.vue'; // <--- IMPORTACIÓN DE VISTA ADMIN
import { useAuthStore } from '@/stores/auth'; // Importar Store para validar rol

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: CartView,
    },
    {
      path: '/login', // <--- NUEVA RUTA
      name: 'login',
      component: LoginView
    },
    {
        path: '/admin',
        name: 'admin',
        component: AdminView,
        beforeEnter: (to, from, next) => {
            const authStore = useAuthStore();
            // Verificar si existe usuario y si su rol es admin
            if (authStore.user && authStore.user.role === 'admin') {
                next(); // Pasa
            } else {
                alert('⛔ Acceso restringido a Administradores');
                next('/'); // Te manda al inicio
            }
        }
    }
    
  ],
})

export default router
