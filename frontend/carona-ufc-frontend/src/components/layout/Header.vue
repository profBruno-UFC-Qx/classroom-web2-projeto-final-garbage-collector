<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="fixed top-0 left-0 z-[1000] w-full border-b border-gray-200 bg-white py-4">

    <div class="mx-auto flex max-w-7xl items-center justify-between px-8">

      <RouterLink to="/" class="text-xl font-semibold text-gray-900">
        <span>Carona UFC</span>
      </RouterLink>

      <nav class="flex gap-3">
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
  </header>
</template>

<style scoped>
</style>
