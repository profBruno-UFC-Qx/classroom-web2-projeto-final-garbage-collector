import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: "/login",
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: "/cadastro",
      name: 'cadastro',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: "/buscar-carona",
      name: 'buscar-carona',
      component: () => import('../views/BuscarCaronaView.vue')
    },
    {
      path: "/oferecer-carona",
      name: 'oferecer-carona',
      component: () => import('../views/OferecerCaronaView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
