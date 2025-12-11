<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  MapPin, Calendar, Clock, Car, Star,
  User, MessageCircle, CheckCircle
} from 'lucide-vue-next'
import BaseButton from '@/components/base/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const caronaId = route.params.id

const userStatus = ref<'viewer' | 'pending' | 'approved' | 'driver'>('driver')

const isLoading = ref(true)
const carona = ref<any>(null)

const fetchCaronaDetails = async () => {
  isLoading.value = true

  await new Promise(resolve => setTimeout(resolve, 800))

  // Dados Mockados
  carona.value = {
    id: caronaId,
    origem: 'Campus UFC - Quixadá',
    destino: 'Fortaleza - Terminal Rodoviário',
    data: '24/10/2025',
    horario: '18:00',
    observacoes: 'Ponto de encontro na parada de ônibus em frente ao bloco 1. Saio pontualmente.',
    motorista: {
      nome: 'Maria Santos',
      avatar: '/images/profile.png',
      avaliacao: 4.9,
      caronasRealizadas: 42,
      telefone: '(85) 99999-8888'
    },
    veiculo: {
      modelo: 'Honda Civic',
      cor: 'Prata',
      placa: 'ABC-1234'
    },
    vagasTotais: 4,
    passageiros: [
      { id: 1, nome: 'João Silva', status: 'approved' },
      { id: 2, nome: 'Ana Costa', status: 'approved' }
    ]
  }
  isLoading.value = false
}

const vagasOcupadas = computed(() => carona.value?.passageiros.length || 0)
const vagasRestantes = computed(() => (carona.value?.vagasTotais || 0) - vagasOcupadas.value)

const handleSolicitar = () => {
  userStatus.value = 'pending'
  alert('Solicitação enviada! Aguarde a aprovação do motorista.')
}

const handleCancelarSolicitacao = () => {
  if(confirm('Deseja cancelar sua solicitação?')) {
    userStatus.value = 'viewer'
  }
}

const handleSairCarona = () => {
  if(confirm('Tem certeza que deseja desistir desta carona?')) {
    userStatus.value = 'viewer'
  }
}

const handleCancelarCaronaDriver = () => {
  if(confirm('ATENÇÃO: Cancelar a carona notificará todos os passageiros. Deseja continuar?')) {
    alert('Carona cancelada.')
    router.push('/minhas-caronas')
  }
}

const openWhatsApp = () => {
  window.open(`https://wa.me/55${carona.value.motorista.telefone.replace(/\D/g, '')}`, '_blank')
}

onMounted(() => {
  fetchCaronaDetails()
})
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">

    <div v-if="isLoading" class="py-20 text-center text-gray-500">
      Carregando detalhes da viagem...
    </div>

    <div v-else class="space-y-6">

      <div v-if="userStatus === 'pending'" class="rounded-lg bg-yellow-50 p-4 text-yellow-800 border border-yellow-200 flex items-center gap-3">
        <Clock :size="20" />
        <p class="text-sm font-medium">Sua solicitação está pendente. Aguarde a confirmação do motorista.</p>
      </div>

      <div v-if="userStatus === 'approved'" class="rounded-lg bg-green-50 p-4 text-green-800 border border-green-200 flex items-center gap-3">
        <CheckCircle :size="20" />
        <p class="text-sm font-medium">Você está confirmado nesta carona!</p>
      </div>

      <div class="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
        <div class="relative h-48 w-full bg-gray-200 flex items-center justify-center">
          <MapPin :size="48" class="text-gray-400 opacity-50" />
          <span class="absolute mt-16 text-xs text-gray-500 font-medium">Mapa do Trajeto (Google Maps)</span>
        </div>

        <div class="p-6">
          <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div class="flex-1 space-y-6">
              <div class="relative flex gap-4">
                <div class="flex flex-col items-center pt-1">
                  <div class="h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-50"></div>
                  <div class="h-full w-0.5 bg-gray-200 my-1"></div>
                  <div class="h-3 w-3 rounded-full bg-gray-900 ring-4 ring-gray-100"></div>
                </div>

                <div class="flex flex-col justify-between gap-6 pb-1">
                  <div>
                    <p class="text-xs text-gray-500 font-medium uppercase">Origem</p>
                    <p class="text-lg font-semibold text-gray-900">{{ carona.origem }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-medium uppercase">Destino</p>
                    <p class="text-lg font-semibold text-gray-900">{{ carona.destino }}</p>
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
                <p class="text-lg font-semibold text-gray-900">{{ carona.data }}</p>
              </div>
              <div>
                <div class="flex items-center gap-2 text-gray-500 mb-1">
                  <Clock :size="16" />
                  <span class="text-xs font-medium uppercase">Horário</span>
                </div>
                <p class="text-lg font-semibold text-gray-900">{{ carona.horario }}</p>
              </div>
            </div>
          </div>

          <div v-if="carona.observacoes" class="mt-6 rounded-md bg-gray-50 p-4">
            <p class="text-sm text-gray-700">
              <span class="font-semibold">Observações:</span> {{ carona.observacoes }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div class="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h3 class="text-sm font-medium text-gray-500 uppercase mb-4">Motorista</h3>
          <div class="flex items-start gap-4">
            <div class="h-14 w-14 overflow-hidden rounded-full bg-gray-100">
              <img v-if="carona.motorista.avatar" :src="carona.motorista.avatar" alt="Motorista" class="h-full w-full object-cover">
              <div v-else class="flex h-full w-full items-center justify-center text-gray-400">
                <User :size="24" />
              </div>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-gray-900">{{ carona.motorista.nome }}</h4>
              <div class="flex items-center gap-1 mt-1 text-sm text-amber-500">
                <Star :size="16" class="fill-current" />
                <span class="font-medium text-gray-900">{{ carona.motorista.avaliacao }}</span>
                <span class="text-gray-400 mx-1">•</span>
                <span class="text-gray-500">{{ carona.motorista.caronasRealizadas }} caronas</span>
              </div>

              <button
                v-if="userStatus === 'approved'"
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
              <h4 class="text-lg font-semibold text-gray-900">{{ carona.veiculo.modelo }}</h4>
              <p class="text-sm text-gray-600">{{ carona.veiculo.cor }}</p>
              <p class="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-mono font-medium text-gray-700 border border-gray-200">
                {{ carona.veiculo.placa }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <div class="mb-6 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Passageiros</h3>
          <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
            {{ vagasRestantes }} vagas restantes
          </span>
        </div>

        <div class="flex flex-wrap gap-4">
          <div
            v-for="passageiro in carona.passageiros"
            :key="passageiro.id"
            class="flex flex-col items-center gap-2"
          >
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500" title="Passageiro Confirmado">
              <User :size="20" />
            </div>
            <span class="text-xs font-medium text-gray-700">{{ passageiro.nome.split(' ')[0] }}</span>
          </div>

          <div
            v-for="i in vagasRestantes"
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

        <template v-if="userStatus === 'driver'">
          <BaseButton variant="secondary" @click="router.push('/minhas-caronas')">
            Voltar
          </BaseButton>
          <BaseButton @click="handleCancelarCaronaDriver" class="bg-red-600 hover:bg-red-700 border-red-600 focus:ring-red-600">
            Cancelar Carona
          </BaseButton>
        </template>

        <template v-else>
          <BaseButton variant="secondary" @click="router.back()">
            Voltar
          </BaseButton>

          <BaseButton v-if="userStatus === 'viewer'" @click="handleSolicitar" :disabled="vagasRestantes === 0">
            {{ vagasRestantes > 0 ? 'Solicitar Vaga' : 'Carona Lotada' }}
          </BaseButton>

          <BaseButton v-if="userStatus === 'pending'" variant="secondary" @click="handleCancelarSolicitacao">
            Cancelar Solicitação
          </BaseButton>

          <BaseButton v-if="userStatus === 'approved'" variant="secondary" class="text-red-600 hover:bg-red-50 border-red-200" @click="handleSairCarona">
            Sair da Carona
          </BaseButton>
        </template>

      </div>

    </div>
  </div>
</template>
