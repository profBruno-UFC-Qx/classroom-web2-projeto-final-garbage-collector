<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { MapPin, Calendar, Clock, Car, Users, FileText, AlertCircle, Loader2 } from 'lucide-vue-next'
import { useVehicleStore } from '@/stores/vehicle'
import { useRideStore } from '@/stores/ride'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { getErrorMessage } from '@/utils/errorHandler'
import type { RideForm } from '@/types'
import { getMinDate } from '@/utils/dateHandler'

const router = useRouter()
const vehicleStore = useVehicleStore()
const rideStore = useRideStore()

const form = ref<RideForm>({
  origin: '',
  destination: '',
  date: '',
  time: '',
  seats: 3,
  vehicleId: '',
  observation: ''
})

const hasVehicles = computed(() => vehicleStore.vehicles.length > 0)

onMounted(async () => {
  try {
    await vehicleStore.fetchVehicles()

    if (vehicleStore.vehicles.length > 0) {
      form.value.vehicleId = vehicleStore.vehicles[0]?.id ?? ''
    }
  } catch (error) {
    console.error('Erro ao buscar veículos:', error)
    toast.error('Não foi possível carregar seus veículos.')
  }
})

const handleSubmit = async () => {
  if (!form.value.vehicleId) {
    toast.warn('Por favor, selecione um veículo.')
    return
  }

  try {
    await rideStore.createRide({
      origin: form.value.origin,
      destination: form.value.destination,
      date: form.value.date,
      time: form.value.time,
      seats: Number(form.value.seats),
      vehicleId: Number(form.value.vehicleId),
      observation: form.value.observation
    })

    toast.success('Carona publicada com sucesso!')

    router.push('/minhas-caronas')

  }
  catch (error) {
    console.error('Erro ao criar carona:', error)
    toast.error(getErrorMessage(error, 'Erro ao publicar carona.'))
  }
}
</script>

<template>
  <div class="mx-auto min-w-[700px] px-4 py-8">

    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Oferecer Carona</h1>
      <p class="mt-1 text-sm text-gray-600">Preencha os dados da viagem e compartilhe seu trajeto.</p>
    </div>

    <div v-if="vehicleStore.isLoading" class="flex flex-col items-center justify-center py-10 text-gray-500">
      <Loader2 class="mb-2 h-8 w-8 animate-spin text-blue-600" />
      <p>Carregando seus veículos...</p>
    </div>

    <div v-else-if="!hasVehicles" class="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
      <div class="flex justify-center mb-4">
        <AlertCircle class="h-10 w-10 text-yellow-600" />
      </div>
      <h3 class="text-lg font-medium text-yellow-800">Você precisa de um veículo</h3>
      <p class="mt-2 text-sm text-yellow-700">Para oferecer caronas, é necessário cadastrar um carro primeiro.</p>
      <div class="mt-6">
        <BaseButton @click="router.push('/meus-veiculos/novo')">
          Cadastrar Veículo Agora
        </BaseButton>
      </div>
    </div>

    <div v-else class="rounded-lg border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Veículo</label>
          <div class="relative">
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Car :size="20" />
            </div>
            <select
              v-model="form.vehicleId"
              class="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              required
            >
              <option disabled value="">Selecione um veículo</option>
              <option
                v-for="v in vehicleStore.vehicles"
                :key="v.id"
                :value="v.id"
              >
                {{ v.brand }} {{ v.model }} ({{ v.plate }})
              </option>
            </select>
          </div>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <BaseInput
            id="origin"
            v-model="form.origin"
            label="Origem"
            placeholder="Ex: UFC - Campus Quixadá"
            required
          >
            <template #icon><MapPin :size="20" /></template>
          </BaseInput>

          <BaseInput
            id="destination"
            v-model="form.destination"
            label="Destino"
            placeholder="Ex: Rodoviária de Quixadá"
            required
          >
            <template #icon><MapPin :size="20" /></template>
          </BaseInput>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <BaseInput
            id="date"
            v-model="form.date"
            type="date"
            label="Data"
            required
            :min="getMinDate()"
          >
            <template #icon><Calendar :size="20" /></template>
          </BaseInput>

          <BaseInput
            id="time"
            v-model="form.time"
            type="time"
            label="Horário"
            required
          >
            <template #icon><Clock :size="20" /></template>
          </BaseInput>

          <BaseInput
            id="seats"
            v-model="form.seats"
            type="number"
            label="Vagas"
            min="1"
            max="6"
            required
          >
            <template #icon><Users :size="20" /></template>
          </BaseInput>
        </div>

        <BaseInput
          id="observation"
          v-model="form.observation"
          type="textarea"
          label="Observações (Opcional)"
          placeholder="Ex: Vou passar no centro antes de ir para a rodoviária."
          rows="3"
        >
          <template #icon><FileText :size="20" /></template>
        </BaseInput>

        <div class="pt-2">
          <BaseButton
            type="submit"
            class="w-full justify-center"
            :disabled="rideStore.isLoading"
          >
            <span v-if="rideStore.isLoading" class="flex items-center gap-2">
               <Loader2 class="animate-spin h-4 w-4" /> Criando...
            </span>
            <span v-else>Publicar Carona</span>
          </BaseButton>
        </div>

      </form>
    </div>
  </div>
</template>
