<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import {
  MapPin, Calendar, Clock, Car,
  User, MessageCircle, CheckCircle, X, Check, Loader2, AlertCircle, Flag, LogOut
} from 'lucide-vue-next'
import BaseButton from '@/components/base/BaseButton.vue'
import api from '@/utils/api'
import { getErrorMessage } from '@/utils/errorHandler'
import { useAuthStore } from '@/stores/auth'
import type { Carona } from '@/types'
import { formatISOToBr, getNowInBrazil } from '@/utils/dateHandler'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const caronaId = route.params.id

const isLoading = ref(true)
const isActionLoading = ref(false)
const carona = ref<Carona | null>(null)

const isDriver = computed(() => {
  return carona.value?.driver.id === authStore.user?.id
})

const passageirosAprovados = computed(() => {
  return carona.value?.passengers?.filter(p => p.status === 'approved') || []
})

const solicitacoesPendentes = computed(() => {
  if (!isDriver.value) return []
  return carona.value?.passengers?.filter(p => p.status === 'pending') || []
})

const userStatus = computed(() => {
  if (isDriver.value) return 'driver'
  return carona.value?.userRequestStatus || 'viewer'
})

const vagasDisponiveis = computed(() => carona.value?.seats || 0)

const dataFormatada = computed(() => {
  return carona.value?.date ? formatISOToBr(carona.value.date) : ''
})

const canFinishRide = computed(() => {
  if (!carona.value || !isDriver.value) return false
  if (carona.value.status === 'cancelled' || carona.value.status === 'finished') return false

  const today = getNowInBrazil()
  const rideDate = new Date(carona.value.date)

  today.setHours(0, 0, 0, 0)
  rideDate.setHours(0, 0, 0, 0)

  return rideDate <= today
})

const fetchCaronaDetails = async () => {
  try {
    isLoading.value = true
    const response = await api.get<Carona>(`/rides/${caronaId}`)
    carona.value = response.data
  }
  catch (error) {
    console.error(error)
    toast.error(getErrorMessage(error, 'Erro ao carregar detalhes.'))
    router.push('/buscar-carona')
  }
  finally {
    isLoading.value = false
  }
}

const handleSolicitar = async () => {
  try {
    isActionLoading.value = true
    await api.post(`/rides/${caronaId}/request`)
    toast.success('Solicitação enviada! Aguarde a aprovação.')
    await fetchCaronaDetails()
  }
  catch (error) {
    toast.error(getErrorMessage(error, 'Erro ao solicitar vaga.'))
  }
  finally {
    isActionLoading.value = false
  }
}

const handleGerenciarSolicitacao = async (requestId: number, action: 'accept' | 'reject') => {
  try {
    await api.patch(`/rides/requests/${requestId}/handle`, { action })
    toast.success(action === 'accept' ? 'Passageiro aceito!' : 'Solicitação recusada.')
    await fetchCaronaDetails()
  }
  catch (error) {
    toast.error(getErrorMessage(error, 'Erro ao processar solicitação.'))
  }
}

const handleCancelarCaronaDriver = async () => {
  if(!confirm('ATENÇÃO: Cancelar a carona notificará todos os passageiros. Deseja continuar?')) return

  try {
    isActionLoading.value = true
    await api.patch(`/rides/${caronaId}/cancel`)
    toast.success('Carona cancelada com sucesso.')
    await fetchCaronaDetails()
  }
  catch (error) {
    toast.error(getErrorMessage(error, 'Erro ao cancelar carona.'))
  }
  finally {
    isActionLoading.value = false
  }
}

const handleFinalizarCarona = async () => {
  if(!confirm('Confirmar a chegada ao destino e finalizar a carona?')) return

  try {
    isActionLoading.value = true
    await api.patch(`/rides/${caronaId}/finish`)
    toast.success('Carona finalizada com sucesso!')
    await fetchCaronaDetails()
  }
  catch (error) {
    toast.error(getErrorMessage(error, 'Erro ao finalizar carona.'))
  }
  finally {
    isActionLoading.value = false
  }
}

const handleSairCarona = async () => {
  if(!confirm('Tem certeza que deseja sair desta carona? Sua vaga será liberada.')) return

  try {
    isActionLoading.value = true
    await api.patch(`/rides/${caronaId}/leave`)
    toast.success('Você saiu da carona.')
    await fetchCaronaDetails()
  }
  catch (error) {
    toast.error(getErrorMessage(error, 'Erro ao sair da carona.'))
  }
  finally {
    isActionLoading.value = false
  }
}

const openWhatsApp = () => {
  if (carona.value?.driver.phone) {
    const phone = carona.value.driver.phone.replace(/\D/g, '')
    window.open(`https://wa.me/55${phone}`, '_blank')
  } else {
    toast.warn('Motorista não cadastrou telefone.')
  }
}

onMounted(() => {
  fetchCaronaDetails()
})
</script>

<template>
  <div class="mx-auto w-[700px] space-y-6 pb-12">

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-gray-500">
      <Loader2 class="mb-2 h-10 w-10 animate-spin text-blue-600" />
      <p>Carregando detalhes da viagem...</p>
    </div>

    <div v-else-if="carona" class="space-y-6">

      <div v-if="carona.status === 'cancelled'" class="rounded-lg bg-red-100 p-4 text-red-900 border border-red-300 flex items-center gap-3">
        <AlertCircle :size="20" />
        <p class="text-sm font-bold">Esta carona foi cancelada pelo motorista.</p>
      </div>

      <div v-else-if="carona.status === 'finished'" class="rounded-lg bg-gray-100 p-4 text-gray-800 border border-gray-300 flex items-center gap-3">
        <Flag :size="20" />
        <p class="text-sm font-bold">Esta viagem foi finalizada.</p>
      </div>

      <div v-else-if="userStatus === 'pending'" class="rounded-lg bg-yellow-50 p-4 text-yellow-800 border border-yellow-200 flex items-center gap-3">
        <Clock :size="20" />
        <p class="text-sm font-medium">Sua solicitação está pendente. Aguarde a confirmação do motorista.</p>
      </div>

      <div v-else-if="userStatus === 'approved'" class="rounded-lg bg-green-50 p-4 text-green-800 border border-green-200 flex items-center gap-3">
        <CheckCircle :size="20" />
        <p class="text-sm font-medium">Você está confirmado nesta carona!</p>
      </div>

      <div v-else-if="userStatus === 'rejected'" class="rounded-lg bg-red-50 p-4 text-red-800 border border-red-200 flex items-center gap-3">
        <X :size="20" />
        <p class="text-sm font-medium">Sua solicitação foi recusada pelo motorista.</p>
      </div>

      <div class="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
        <div class="p-6">
          <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div class="flex-1 space-y-6">
              <div class="relative flex gap-4">
                <div class="flex flex-col items-center pt-1">
                  <div class="h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-50"></div>
                  <div class="h-full w-0.5 bg-gray-200 my-1"></div>
                  <MapPin :size="18" class="text-indigo-600 fill-indigo-100" />
                </div>

                <div class="flex flex-col justify-between gap-6 pb-1">
                  <div>
                    <p class="text-xs text-gray-500 font-medium uppercase">Origem</p>
                    <p class="text-lg font-semibold text-gray-900">{{ carona.origin }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-medium uppercase">Destino</p>
                    <p class="text-lg font-semibold text-gray-900">{{ carona.destination }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-row gap-6 border-t border-gray-100 pt-6 md:flex-col md:border-t-0 md:border-l md:pl-8 md:pt-0">
              <div>
                <div class="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar :size="16" />
                  <span class="text-xs font-medium uppercase">Data</span>
                </div>
                <p class="text-lg font-semibold text-gray-900">{{ dataFormatada }}</p>
              </div>
              <div>
                <div class="flex items-center gap-2 text-gray-500 mb-1">
                  <Clock :size="16" />
                  <span class="text-xs font-medium uppercase">Horário</span>
                </div>
                <p class="text-lg font-semibold text-gray-900">{{ carona.time }}</p>
              </div>
            </div>
          </div>

          <div v-if="carona.observation" class="mt-6 rounded-md bg-gray-50 p-4">
            <p class="text-sm text-gray-700">
              <span class="font-semibold">Observações:</span> {{ carona.observation }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="isDriver && solicitacoesPendentes.length > 0 && carona.status === 'open'" class="rounded-lg bg-blue-50 border border-blue-100 p-6">
        <h3 class="flex items-center gap-2 text-lg font-semibold text-blue-900 mb-4">
           <User :size="20" /> Solicitações Pendentes
        </h3>
        <div class="grid gap-4 md:grid-cols-2">
            <div
                v-for="req in solicitacoesPendentes"
                :key="req.id"
                class="flex items-center justify-between rounded-md bg-white p-3 shadow-sm"
            >
                <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <img v-if="req.avatar" :src="req.avatar" class="h-full w-full object-cover" />
                        <User v-else :size="20" class="text-gray-500" />
                    </div>
                    <span class="font-medium text-gray-900">{{ req.name }}</span>
                </div>
                <div class="flex gap-2">
                    <button
                        @click="handleGerenciarSolicitacao(req.id, 'reject')"
                        class="p-2 rounded-full text-red-600 hover:bg-red-50 transition"
                        title="Recusar"
                    >
                        <X :size="20" />
                    </button>
                    <button
                        @click="handleGerenciarSolicitacao(req.id, 'accept')"
                        class="p-2 rounded-full text-green-600 hover:bg-green-50 transition"
                        title="Aceitar"
                    >
                        <Check :size="20" />
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div class="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h3 class="text-sm font-medium text-gray-500 uppercase mb-4">Motorista</h3>
          <div class="flex items-start gap-4">
            <div class="h-14 w-14 overflow-hidden rounded-full bg-gray-100">
              <img v-if="carona.driver.avatar" :src="carona.driver.avatar" alt="Motorista" class="h-full w-full object-cover">
              <div v-else class="flex h-full w-full items-center justify-center text-gray-400">
                <User :size="24" />
              </div>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-gray-900">{{ carona.driver.name.split(' ').slice(0, 2).join(' ') }}</h4>
              <div class="flex items-center gap-1 mt-1 text-sm text-amber-500">
                <span class="font-medium text-gray-900">Caronas realizadas: {{ carona.driver.totalRides }}</span>
              </div>

              <button
                v-if="userStatus === 'approved' && !isDriver && carona.driver.showPhone && carona.status !== 'finished'"
                @click="openWhatsApp"
                class="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700"
              >
                <MessageCircle :size="16" />
                Entrar em contato
              </button>
            </div>
          </div>
        </div>

        <div class="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h3 class="text-sm font-medium text-gray-500 uppercase mb-4">Veículo</h3>
          <div class="flex items-start gap-4">
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Car :size="28" />
            </div>
            <div>
              <h4 class="text-lg font-semibold text-gray-900">{{ carona.vehicle.model }}</h4>
              <p class="text-sm text-gray-600">{{ carona.vehicle.color }}</p>
              <p class="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-mono font-medium text-gray-700 border border-gray-200">
                {{ carona.vehicle.plate }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <div class="mb-6 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Passageiros Confirmados</h3>
          <span
            class="rounded-full px-3 py-1 text-xs font-bold"
            :class="vagasDisponiveis > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'"
          >
            {{ vagasDisponiveis }} vaga(s) restantes
          </span>
        </div>

        <div class="flex flex-wrap gap-4">
          <div
            v-for="passageiro in passageirosAprovados"
            :key="passageiro.id"
            class="flex flex-col items-center gap-2"
          >
            <div class="h-12 w-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                <img v-if="passageiro.avatar" :src="passageiro.avatar" class="h-full w-full object-cover" />
                <User v-else :size="20" class="text-gray-500" />
            </div>
            <span class="text-xs font-medium text-gray-700">{{ passageiro.name.split(' ')[0] }}</span>
          </div>

          <div
            v-for="i in vagasDisponiveis"
            :key="`vaga-${i}`"
            class="flex flex-col items-center gap-2"
          >
            <div class="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-300">
              <User :size="20" />
            </div>
            <span class="text-xs text-gray-400">Livre</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">

        <template v-if="isDriver">
          <BaseButton variant="secondary" @click="router.push('/minhas-caronas')">
            Voltar
          </BaseButton>

          <BaseButton
             v-if="carona.status !== 'cancelled' && carona.status !== 'finished'"
             @click="handleCancelarCaronaDriver"
             class="bg-red-600 hover:bg-red-700 border-red-600 focus:ring-red-600"
             :disabled="isActionLoading"
           >
            <Loader2 v-if="isActionLoading" class="animate-spin mr-2 h-4 w-4" />
            Cancelar Carona
          </BaseButton>

          <BaseButton
             v-if="canFinishRide"
             @click="handleFinalizarCarona"
             class="bg-blue-600 hover:bg-blue-700 border-blue-600"
             :disabled="isActionLoading"
           >
            <CheckCircle v-if="!isActionLoading" class="mr-2 h-4 w-4" />
            <Loader2 v-else class="animate-spin mr-2 h-4 w-4" />
            Finalizar Carona
          </BaseButton>
        </template>

        <template v-else>
          <BaseButton variant="secondary" @click="router.back()">
            Voltar
          </BaseButton>

          <BaseButton
             v-if="userStatus === 'viewer' || userStatus === 'left'"
             @click="handleSolicitar"
             :disabled="vagasDisponiveis === 0 || isActionLoading || carona.status === 'cancelled' || carona.status === 'finished'"
          >
            <Loader2 v-if="isActionLoading" class="animate-spin mr-2 h-4 w-4" />
            {{ vagasDisponiveis > 0 ? 'Solicitar Vaga' : 'Carona Lotada' }}
          </BaseButton>

          <BaseButton v-if="userStatus === 'pending'" variant="secondary" disabled>
             Aguardando Aprovação
          </BaseButton>

          <BaseButton
             v-if="userStatus === 'approved' && carona.status !== 'finished' && carona.status !== 'cancelled'"
             @click="handleSairCarona"
             variant="outline"
             class="bg-red-600 hover:bg-red-700 border-red-600 focus:ring-red-600"
             :disabled="isActionLoading"
          >
            <LogOut v-if="!isActionLoading" class="mr-2 h-4 w-4" />
            <Loader2 v-else class="animate-spin mr-2 h-4 w-4" />
            Sair da Carona
          </BaseButton>
        </template>

      </div>

    </div>
  </div>
</template>
