<script setup lang="ts">
import { ref } from 'vue'
import { Search } from 'lucide-vue-next'
import BaseButton from '@/components/base/BaseButton.vue'
import RideCard from '@/components/rides/RideCard.vue'

const origem = ref('')
const destino = ref('')
const data = ref('')

const handleSearch = (e: Event) => {
  e.preventDefault()
  // Implementar lógica de busca
  console.log('Buscar caronas:', {
    origem: origem.value,
    destino: destino.value,
    data: data.value,
  })
}
</script>

<template>
  <div class="w-full">

    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Buscar Caronas
      </h1>
      <p class="mt-1 text-base text-gray-600">
        Encontre caronas disponíveis para seu destino
      </p>
    </div>

    <!-- Search Form -->
    <div class="mb-8 rounded-lg bg-white p-6 shadow-sm">
      <form @submit="handleSearch" class="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">

        <!-- Origem -->
        <div class="lg:col-span-3">
          <label for="origem" class="mb-2 block text-sm font-medium text-gray-700">
            Origem
          </label>
          <select
            v-model="origem"
            id="origem"
            name="origem"
            class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="" disabled selected>Selecione...</option>
            <option value="campus-qxd">Campus UFC - Quixadá</option>
            <option value="centro-qxd">Centro - Quixadá</option>
            <option value="rodoviaria-for">Fortaleza - Rodoviária</option>
          </select>
        </div>

        <!-- Destino -->
        <div class="lg:col-span-3">
          <label for="destino" class="mb-2 block text-sm font-medium text-gray-700">
            Destino
          </label>
          <select
            v-model="destino"
            id="destino"
            name="destino"
            class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="" disabled selected>Selecione...</option>
            <option value="campus-qxd">Campus UFC - Quixadá</option>
            <option value="centro-qxd">Centro - Quixadá</option>
            <option value="rodoviaria-for">Fortaleza - Rodoviária</option>
          </select>
        </div>

        <!-- Data -->
        <div class="lg:col-span-3">
          <label for="data" class="mb-2 block text-sm font-medium text-gray-700">
            Data
          </label>
          <input
            v-model="data"
            type="date"
            id="data"
            name="data"
            class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
        </div>

        <!-- Botão Buscar -->
        <div class="lg:col-span-3">
          <BaseButton type="submit">
            <Search :size="18" />
            Buscar
          </BaseButton>
        </div>

      </form>
    </div>

    <!-- Results Section -->
    <div>

      <!-- Results Header -->
      <div class="mb-6">
        <p class="text-base text-gray-600">
          4 carona(s) disponível(is)
        </p>
      </div>

      <!-- Ride Cards Grid -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <RideCard />
        <RideCard />
        <RideCard />
        <RideCard />
      </div>

    </div>
  </div>
</template>
