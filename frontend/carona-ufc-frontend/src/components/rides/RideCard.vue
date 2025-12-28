<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import {
  MapPin, Calendar, Users, Clock, CheckCircle, AlertCircle, XCircle
} from 'lucide-vue-next'

import type { PropType } from 'vue'
import type { Carona } from '@/types'

import defaultAvatarImg from '@/assets/images/profile.png'

const props = defineProps({
  role: {
    type: String as PropType<'motorista' | 'passageiro' | 'viewer'>,
    default: 'viewer'
  },
  carona: {
    type: Object as PropType<Carona | null>,
    default: null
  }
})

const router = useRouter()

const statusInfo = computed(() => {
  if (!props.carona) return null

  if (props.carona.status === 'cancelled') {
    return { text: 'Cancelada', color: 'bg-red-100 text-red-700', icon: AlertCircle }
  }

  const myStatus = props.carona.userRequestStatus

  if (myStatus === 'pending') {
    return { text: 'Pendente', color: 'bg-yellow-100 text-yellow-700', icon: Clock }
  }
  if (myStatus === 'approved') {
    return { text: 'Confirmado', color: 'bg-green-100 text-green-700', icon: CheckCircle }
  }
  if (myStatus === 'rejected') {
    return { text: 'Recusado', color: 'bg-red-100 text-red-700', icon: XCircle }
  }

  if (props.carona.status === 'full' || props.carona.seats === 0) {
    return { text: 'Lotada', color: 'bg-gray-100 text-gray-600', icon: XCircle }
  }

  return null
})

const buttonLabel = computed(() => {
  if (props.role === 'motorista') return 'Gerenciar'

  if (props.carona?.status === 'cancelled') return 'Ver Detalhes'

  if (props.carona?.userRequestStatus === 'approved') return 'Ver Detalhes'
  if (props.carona?.userRequestStatus === 'pending') return 'Aguardando...'

  if (props.carona?.seats === 0) return 'Ver Detalhes'

  return 'Solicitar Vaga'
})

const isButtonDisabled = computed(() => {
    return false
})

const buttonVariant = computed(() => {
  if (props.role === 'viewer' && props.carona?.seats && props.carona.seats > 0 && !props.carona.userRequestStatus) {
      return 'primary'
  }
  return 'secondary'
})

const formattedDate = computed(() => {
  if (!props.carona?.date) return ''
  const [year, month, day] = props.carona.date.split('-')
  return `${day}/${month}`
})

const handleAction = () => {
  if (props.carona?.id) {
    router.push(`/carona/${props.carona.id}`)
  }
}
</script>

<template>
  <div class="relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md h-full">

    <div
      v-if="statusInfo"
      class="absolute top-6 right-6 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
      :class="statusInfo.color"
    >
      <component :is="statusInfo.icon" :size="12" />
      {{ statusInfo.text }}
    </div>

    <div>
      <div class="flex items-center gap-3 mb-4 pr-16"> <img
          :src="carona?.driver.avatar || defaultAvatarImg"
          alt="Avatar"
          class="h-12 w-12 rounded-full object-cover ring-2 ring-gray-50"
        />
        <div class="overflow-hidden">
          <h3 class="truncate font-semibold text-gray-900" :title="carona?.driver.name">
            {{ carona?.driver.name || 'Motorista' }}
          </h3>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span class="truncate text-sm text-gray-500" :title="carona?.vehicle.model">
              {{ carona?.vehicle.model || 'Veículo' }}
            </span>
          </div>
        </div>
      </div>

      <div class="mb-5 relative">
        <div class="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 border border-blue-100">
          <div class="flex gap-4">
            <div class="flex flex-col items-center pt-1">
              <div class="relative">
                <div class="h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-100"></div>
              </div>
              <div class="flex-1 w-0.5 my-2 bg-gradient-to-b from-blue-400 via-blue-300 to-indigo-400 min-h-[60px]"></div>
              <div class="relative">
                <MapPin :size="18" class="text-indigo-600 fill-indigo-100" />
              </div>
            </div>

            <div class="flex-1 flex flex-col justify-between py-0.5 gap-3">
              <div class="group">
                <div class="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-1">
                  Origem
                </div>
                <div class="text-sm font-semibold text-gray-900 leading-snug">
                  {{ carona?.origin }}
                </div>
              </div>

              <div class="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>

              <div class="group">
                <div class="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                  Destino
                </div>
                <div class="text-sm font-semibold text-gray-900 leading-snug">
                  {{ carona?.destination }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between text-sm text-gray-600 mb-4 border-t border-gray-100 pt-3">
        <div class="flex items-center gap-1.5" title="Data e Hora">
          <Calendar :size="16" class="text-gray-400"/>
          <span class="font-medium">{{ formattedDate }}</span>
          <span class="text-gray-300">|</span>
          <span>{{ carona?.time }}</span>
        </div>

        <div class="flex items-center gap-1.5" title="Vagas Disponíveis">
          <Users :size="16" class="text-gray-400" />
          <span :class="carona?.seats === 0 ? 'text-red-600 font-medium' : ''">
            {{ carona?.seats }} {{ carona?.seats === 1 ? 'vaga' : 'vagas' }}
          </span>
        </div>
      </div>

      <BaseButton
        class="w-full justify-center"
        :variant="buttonVariant"
        @click="handleAction"
        :disabled="isButtonDisabled"
      >
        {{ buttonLabel }}
      </BaseButton>
    </div>
  </div>
</template>
