<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Search, MapPin, Calendar, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-vue-next'
import RideCard from '@/components/rides/RideCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import api from '@/utils/api'
import { toast } from 'vue3-toastify'
import { getErrorMessage } from '@/utils/errorHandler'
import type { Carona, PaginatedResponse } from '@/types'
import { getMinDate } from '@/utils/dateHandler'

const isLoading = ref(false)
const caronas = ref<Carona[]>([])
const hasSearched = ref(false)

const origem = ref('')
const destino = ref('')
const dataViagem = ref('')

const currentPage = ref(1)
const totalPages = ref(1)
const totalResults = ref(0)
const itemsPerPage = 10

const hasActiveFilters = computed(() => {
  return origem.value !== '' || destino.value !== '' || dataViagem.value !== ''
})

const fetchCaronas = async (page = 1) => {
  isLoading.value = true
  currentPage.value = page

  try {
    const params = new URLSearchParams()
    if (origem.value) params.append('origin', origem.value)
    if (destino.value) params.append('destination', destino.value)
    if (dataViagem.value) params.append('date', dataViagem.value)

    params.append('page', page.toString())
    params.append('limit', itemsPerPage.toString())

    const response = await api.get<PaginatedResponse<Carona>>(`/rides?${params.toString()}`)

    caronas.value = response.data.data
    totalPages.value = response.data.meta.totalPages
    totalResults.value = response.data.meta.total

    if (page > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

  } catch (error) {
    console.error('Erro ao buscar caronas:', error)
    toast.error(getErrorMessage(error, 'Não foi possível buscar as caronas.'))
    caronas.value = []
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  hasSearched.value = true
  fetchCaronas(1)
}

const handlePageChange = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    fetchCaronas(newPage)
  }
}

const clearFilters = () => {
  origem.value = ''
  destino.value = ''
  dataViagem.value = ''
  fetchCaronas(1)
}

onMounted(() => {
  fetchCaronas()
})
</script>

<template>
  <div class="w-full">

    <div class="mb-8">
      <h1 class="text-3xl font-semibold text-gray-900">Buscar Caronas</h1>
      <p class="mt-2 text-base text-gray-600">Encontre caronas disponíveis para seu destino.</p>
    </div>

    <div class="mb-8 rounded-lg bg-white p-6 shadow-sm">
      <form @submit.prevent="handleSearch" class="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">

        <div class="lg:col-span-4">
          <BaseInput
            id="origin"
            v-model="origem"
            label="Origem"
            placeholder="Ex: Campus Quixadá"
          >
            <template #icon><MapPin :size="20" /></template>
          </BaseInput>
        </div>

        <div class="lg:col-span-4">
          <BaseInput
            id="destination"
            v-model="destino"
            label="Destino"
            placeholder="Ex: Rodoviária Fortaleza"
          >
            <template #icon><MapPin :size="20" /></template>
          </BaseInput>
        </div>

        <div class="lg:col-span-2">
           <BaseInput
              v-model="dataViagem"
              label="Data"
              id="data"
              type="date"
              showFormatted
              placeholder="dd/mm/yyyy"
              :min="getMinDate()"
            >
              <template #icon><Calendar :size="20" /></template>
            </BaseInput>
        </div>

        <div class="lg:col-span-2">
          <BaseButton
            type="submit"
            :disabled="isLoading"
            class="w-full justify-center"
            @click="handleSearch"
          >
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
            {{ totalResults }} carona{{ totalResults !== 1 ? 's' : '' }} encontrada{{ totalResults !== 1 ? 's' : '' }}
          </span>
        </p>
        <button
          v-if="hasActiveFilters && caronas.length > 0 && hasSearched"
          @click="clearFilters"
          class="flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          Limpar filtros
          <X :size="14" />
        </button>
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
            @click="clearFilters"
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

      <div v-if="totalPages > 1 && !isLoading" class="flex items-center justify-center gap-4 pt-4 border-t border-gray-200 mt-8">
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-gray-700"
        >
          <ChevronLeft :size="16" />
          Anterior
        </button>

        <span class="text-sm font-medium text-gray-900">
          Página {{ currentPage }} de {{ totalPages }}
        </span>

        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-gray-700"
        >
          Próxima
          <ChevronRight :size="16" />
        </button>
      </div>

    </div>
  </div>
</template>
