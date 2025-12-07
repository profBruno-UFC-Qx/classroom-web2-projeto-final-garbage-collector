<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { MapPin, Calendar, Users, Star } from 'lucide-vue-next'

import type { PropType } from 'vue'
import type { Carona } from '@/types'

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

const buttonLabel = computed(() => {
  if (props.role === 'motorista') return 'Gerenciar Carona'
  if (props.role === 'passageiro') return 'Ver Detalhes'
  return 'Solicitar Vaga'
})

const buttonVariant = computed(() => {
  if (props.role === 'viewer') return 'primary'
  return 'secondary'
})

const handleAction = () => {
  console.log(`Ação acionada para papel: ${props.role}`)
}
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">

    <div class="flex items-center gap-3 mb-3">
      <img
        src="/images/profile.png"
        alt="Avatar"
        class="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
      />
      <div>
        <h3 class="font-semibold text-gray-900">
          {{ carona?.motorista || 'Maria Santos' }}
        </h3>
        <div class="flex items-center gap-1.5 mt-0.5">
          <Star :size="14" class="fill-amber-400 text-amber-400" />
          <span class="text-sm text-gray-600">4.9</span>
          <span class="text-gray-300">•</span>
          <span class="text-sm text-gray-500">Honda Civic</span>
        </div>
      </div>
    </div>

    <div class="mb-5 rounded-lg bg-gray-50 p-4">
      <div class="flex items-start gap-3">
        <div class="flex flex-col items-center gap-1.5 pt-1">
          <div class="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
          <div class="h-8 w-0.5 bg-gray-300"></div>
          <MapPin :size="16" class="text-ufc-green" />
        </div>

        <div class="flex flex-col gap-9 text-sm">
          <span class="font-medium text-gray-900">
            de: {{ carona?.origem || 'Quixadá - Campus UFC' }}
          </span>
          <span class="font-medium text-gray-900">
            para: {{ carona?.destino || 'Fortaleza - Terminal Rodoviário' }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
      <div class="flex items-center gap-1.5">
        <Calendar :size="16" class="text-gray-400"/>
        <span>{{ carona?.data || '24/10' }} às {{ carona?.horario || '18:00' }}</span>
      </div>
      <div class="flex items-center gap-1.5">
        <Users :size="16" class="text-gray-400" />
        <span>2 vagas</span>
      </div>
    </div>

    <BaseButton
      class="w-full"
      :variant="buttonVariant"
      @click="handleAction"
    >
      {{ buttonLabel }}
    </BaseButton>
  </div>
</template>
