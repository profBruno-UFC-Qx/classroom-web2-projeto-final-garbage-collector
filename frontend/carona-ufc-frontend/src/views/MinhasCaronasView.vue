<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Calendar, History, Car, Search, Loader2 } from 'lucide-vue-next'
import RideCard from '@/components/rides/RideCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue3-toastify'
import api from '@/utils/api'
import { getErrorMessage } from '@/utils/errorHandler'
import { useAuthStore } from '@/stores/auth'
import type { Carona } from '@/types'

const authStore = useAuthStore()
const activeTab = ref<'agendadas' | 'historico'>('agendadas')
const isLoading = ref(true)

const caronasAgendadas = ref<Carona[]>([])
const historicoCaronas = ref<Carona[]>([])

const hasRidesAgendadas = computed(() => caronasAgendadas.value.length > 0)
const hasHistory = computed(() => historicoCaronas.value.length > 0)

const fetchMinhasCaronas = async () => {
  isLoading.value = true
  try {
    const response = await api.get<Carona[]>('/rides/me')
    const todasCaronas = response.data

    const agora = new Date()

    caronasAgendadas.value = []
    historicoCaronas.value = []

    todasCaronas.forEach(carona => {
      const dataCarona = new Date(`${carona.date}T${carona.time}`)

      if (dataCarona >= agora && carona.status !== 'cancelled' && carona.status !== 'finished') {
        caronasAgendadas.value.push(carona)
      } else {
        historicoCaronas.value.push(carona)
      }
    })

  }
  catch (error) {
    console.error('Erro ao buscar caronas:', error)
    toast.error(getErrorMessage(error, 'Não foi possível carregar suas viagens.'))
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchMinhasCaronas()
})
</script>

<template>
  <div class="space-y-6 w-full h-full">

    <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900">Minhas Caronas</h1>
        <p class="mt-2 text-gray-600">Gerencie suas viagens agendadas e visualize seu histórico.</p>
      </div>

      <div class="flex gap-3">
        <RouterLink to="/buscar-carona">
          <BaseButton variant="secondary">
            <Search :size="18" />
            Buscar
          </BaseButton>
        </RouterLink>

        <RouterLink
          to="/oferecer-carona"
          v-if="authStore.user?.role === 'motorista'"
        >
          <BaseButton>
            <Car :size="18" />
            Oferecer
          </BaseButton>
        </RouterLink>
      </div>
    </div>

    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          @click="activeTab = 'agendadas'"
          :class="[
            activeTab === 'agendadas'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
          ]"
        >
          <Calendar
            :class="[
              activeTab === 'agendadas' ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500',
              '-ml-0.5 mr-2 h-5 w-5'
            ]"
          />
          <span>Agendadas</span>
          <span
            v-if="hasRidesAgendadas"
            class="ml-3 hidden rounded-full bg-gray-100 py-0.5 px-2.5 text-xs font-medium text-gray-900 md:inline-block"
          >
            {{ caronasAgendadas.length }}
          </span>
        </button>

        <button
          @click="activeTab = 'historico'"
          :class="[
            activeTab === 'historico'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
          ]"
        >
          <History
            :class="[
              activeTab === 'historico' ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500',
              '-ml-0.5 mr-2 h-5 w-5'
            ]"
          />
          <span>Histórico</span>
        </button>
      </nav>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 text-gray-500">
      <Loader2 class="mb-2 h-8 w-8 animate-spin text-blue-600" />
      <p>Carregando suas caronas...</p>
    </div>

    <div v-else-if="activeTab === 'agendadas'">
      <div v-if="!hasRidesAgendadas" class="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <Calendar :size="48" class="mx-auto text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma carona agendada</h3>
        <p class="mt-1 text-sm text-gray-500">
          Você não tem nenhuma viagem programada para os próximos dias.
        </p>
        <div class="mt-6">
          <RouterLink to="/buscar-carona" class="text-sm font-medium text-blue-600 hover:underline">
            Buscar uma carona
          </RouterLink>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="carona in caronasAgendadas"
          :key="carona.id"
          class="relative"
        >
          <div
            class="absolute -top-2 -right-2 z-10 rounded-full px-3 py-1 text-xs font-bold shadow-sm"
            :class="carona.papel === 'motorista' ? 'bg-gray-900 text-white' : 'bg-blue-100 text-blue-700'"
          >
            {{ carona.papel === 'motorista' ? 'Motorista' : 'Passageiro' }}
          </div>

          <RideCard
            :carona="carona"
            :role="carona.papel"
          />
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'historico'">
      <div v-if="!hasHistory" class="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <History :size="48" class="mx-auto text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Histórico vazio</h3>
        <p class="mt-1 text-sm text-gray-500">
          Suas viagens realizadas aparecerão aqui.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-75 grayscale transition-all hover:opacity-100 hover:grayscale-0">
         <div v-for="carona in historicoCaronas" :key="carona.id">
            <RideCard :carona="carona" :role="carona.papel || 'viewer'" />
         </div>
      </div>
    </div>

  </div>
</template>
