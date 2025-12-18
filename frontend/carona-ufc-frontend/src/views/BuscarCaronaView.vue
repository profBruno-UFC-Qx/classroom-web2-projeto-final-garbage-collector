<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Loader2, MapPin, Calendar } from 'lucide-vue-next'
import { toast } from 'vue3-toastify'
import { vMaska } from 'maska/vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import RideCard from '@/components/rides/RideCard.vue'
import api from '@/utils/api'
import { getErrorMessage } from '@/utils/errorHandler'
import { formatDateToISO } from '@/utils/dateHandler'
import type { Carona } from '@/types'

const isLoading = ref(false)
const caronas = ref<Carona[]>([])

const filters = ref({
  origin: '',
  destination: '',
  date: ''
})

const fetchRides = async () => {
  isLoading.value = true
  try {
    const isoDate = formatDateToISO(filters.value.date)

    const response = await api.get<Carona[]>('/rides', {
      params: {
        origin: filters.value.origin,
        destination: filters.value.destination,
        date: isoDate
      }
    })

    caronas.value = response.data
  }
  catch (error) {
    console.error(error)
    toast.error(getErrorMessage(error, 'Erro ao buscar caronas.'))
  }
  finally {
    isLoading.value = false
  }
}

const handleSearch = (e: Event) => {
  fetchRides()
}

onMounted(() => {
  fetchRides()
})
</script>

<template>
  <div class="w-full">

    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Buscar Caronas
      </h1>
      <p class="mt-2 text-base text-gray-600">
        Encontre caronas disponíveis para seu destino.
      </p>
    </div>

    <div class="mb-8 rounded-lg bg-white p-6 shadow-sm">
      <form @submit.prevent="handleSearch" class="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">

        <div class="lg:col-span-4">
          <BaseInput
            id="origin"
            v-model="filters.origin"
            label="Origem"
            placeholder="Ex: Campus Quixadá"
          >
            <template #icon><MapPin :size="20" /></template>
          </BaseInput>
        </div>

        <div class="lg:col-span-4">
          <BaseInput
            id="destination"
            v-model="filters.destination"
            label="Destino"
            placeholder="Ex: Rodoviária Fortaleza"
          >
            <template #icon><MapPin :size="20" /></template>
          </BaseInput>
        </div>

        <div class="lg:col-span-2">
           <BaseInput
            id="date"
            type="text"
            v-model="filters.date"
            label="Data"
            placeholder="DD/MM/AAAA"
            v-maska
            data-maska="##/##/####"
          >
            <template #icon><Calendar :size="20" /></template>
          </BaseInput>
        </div>

        <div class="lg:col-span-2">
          <BaseButton type="submit" :disabled="isLoading" class="w-full justify-center">
            <Loader2 v-if="isLoading" class="animate-spin mr-2 h-5 w-5" />
            <Search v-else :size="18" class="mr-2" />
            Buscar
          </BaseButton>
        </div>

      </form>
    </div>

    <div>

      <div class="mb-6 flex items-center justify-between">
        <p class="text-base text-gray-600">
          <span v-if="isLoading">Buscando...</span>
          <span v-else>
             {{ caronas.length }} {{ caronas.length === 1 ? 'carona encontrada' : 'caronas encontradas' }}
          </span>
        </p>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2 class="mb-2 h-10 w-10 animate-spin text-blue-600" />
        <p>Procurando motoristas...</p>
      </div>

      <div v-else-if="caronas.length === 0" class="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <Search :size="48" class="mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900">Nenhuma carona encontrada</h3>
        <p class="mt-1 text-sm text-gray-500">
          Tente ajustar os filtros ou busque por outra data.
        </p>
        <button
            @click="filters = { origin: '', destination: '', date: '' }; fetchRides()"
            class="mt-4 text-sm font-medium text-blue-600 hover:underline"
        >
            Limpar filtros e ver todas
        </button>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div v-for="carona in caronas" :key="carona.id">
            <RideCard :carona="carona" role="viewer" />
        </div>
      </div>

    </div>
  </div>
</template>
