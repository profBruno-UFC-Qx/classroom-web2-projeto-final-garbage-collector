import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- Rotas Públicas ---
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: "/login",
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: "/cadastro",
      name: 'cadastro',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },

    // --- Rotas Protegidas (Passageiro/Motorista) ---
    {
      path: "/buscar-carona",
      name: 'buscar-carona',
      component: () => import('../views/BuscarCaronaView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: "/carona/:id",
      name: 'carona-detalhes',
      component: () => import('../views/CaronaDetalhesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: "/oferecer-carona",
      name: 'oferecer-carona',
      component: () => import('../views/OferecerCaronaView.vue'),
      meta: {
        requiresAuth: true,
        role: 'motorista'
      }
    },
    {
      path: "/minhas-caronas",
      name: 'minhas-caronas',
      component: () => import('../views/MinhasCaronasView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: "/meus-veiculos",
      name: 'meus-veiculos',
      component: () => import('../views/MeusVeiculosView.vue'),
      meta: {
        requiresAuth: true,
        role: 'motorista'
      }
    },
    {
      path: "/meus-veiculos/novo",
      name: 'novo-veiculo',
      component: () => import('../views/CadastrarVeiculoView.vue'),
      meta: {
        requiresAuth: true,
        role: 'motorista'
      }
    },
    // --- Rotas de Usuário ---
    {
      path: "/perfil",
      name: 'perfil',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    // --- Rotas de ADMIN ---
    {
      path: "/admin",
      name: 'admin-dashboard',
      component: () => import('../views/AdminDashboardView.vue'),
      meta: {
        requiresAuth: true,
        role: 'admin'
      }
    },
    // --- Rota para Acesso Não Autorizado ---
    {
      path: '/sem-permissao',
      name: 'unauthorized',
      component: () => import('../views/UnauthorizedView.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated && authStore.user?.role === 'admin') {
    if (to.path.startsWith('/admin')) {
      return next()
    }
    else {
      return next('/admin')
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  }
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/buscar-carona')
  }
  else if (to.meta.role && authStore.user?.role !== to.meta.role) {
    return next('/sem-permissao')
  }
  else {
    next()
  }
})

export default router
