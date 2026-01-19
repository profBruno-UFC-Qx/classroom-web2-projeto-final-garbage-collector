<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LogOut, User, Shield } from 'lucide-vue-next'

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}

const isAdmin = computed(() => authStore.user?.role === 'admin')
</script>

<template>
  <header class="fixed top-0 left-0 z-[1000] w-full border-b border-gray-200 bg-white py-4">

    <div class="relative mx-auto flex max-w-7xl items-center justify-between px-8">

      <RouterLink to="/" class="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <Shield v-if="isAdmin" class="text-red-600" :size="24" />
        <span v-if="isAdmin">Carona UFC <span class="text-red-600 font-bold">Admin</span></span>
        <span v-else>Carona UFC</span>
      </RouterLink>

      <nav
        v-if="authStore.isAuthenticated && !isAdmin"
        class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-6"
      >
        <RouterLink
          to="/buscar-carona"
          class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          active-class="text-gray-900 font-semibold"
        >
          Buscar
        </RouterLink>

        <RouterLink
          to="/minhas-caronas"
          class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          active-class="text-gray-900 font-semibold"
        >
          Minhas Viagens
        </RouterLink>

        <RouterLink
          v-if="authStore.user?.role === 'motorista'"
          to="/meus-veiculos"
          class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          active-class="text-gray-900 font-semibold"
        >
          Veículos
        </RouterLink>

        <RouterLink
          v-if="authStore.user?.role === 'motorista'"
          to="/oferecer-carona"
          class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          active-class="text-gray-900 font-semibold"
        >
          Oferecer
        </RouterLink>
      </nav>

      <div>

        <div v-if="authStore.isAuthenticated" class="flex items-center gap-4">

          <RouterLink
            v-if="!isAdmin"
            to="/perfil"
            class="flex items-center gap-2 text-sm font-medium text-gray-900 transition-colors hover:text-blue-600"
            title="Meu Perfil"
          >
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <User :size="16" />
            </div>
            <span>{{ authStore.user?.name?.split(' ')[0] }}</span>
          </RouterLink>

          <div v-else class="flex items-center gap-2 text-sm font-medium text-gray-900">
             <div class="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
              <User :size="16" />
            </div>
            <span>Admin</span>
          </div>

          <button
            @click="handleLogout"
            class="text-gray-400 transition-colors hover:text-red-600"
            title="Sair"
          >
            <LogOut :size="20" />
          </button>
        </div>

        <nav v-else class="flex gap-3">
          <RouterLink
            to="/login"
            class="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100"
          >
            Entrar
          </RouterLink>
          <RouterLink
            to="/cadastro"
            class="rounded-md border border-gray-900 bg-gray-900 px-5 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-700 hover:border-gray-700"
          >
            Cadastrar
          </RouterLink>
        </nav>
      </div>

    </div>
  </header>
</template>
