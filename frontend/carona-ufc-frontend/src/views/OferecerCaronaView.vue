<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import { MapPin, Calendar, Clock, Car, Users, FileText, AlertCircle, Loader2, ArrowLeft } from 'lucide-vue-next'
import { useVehicleStore } from '@/stores/vehicle'
import { useRideStore } from '@/stores/ride'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import api from '@/utils/api'
import { getErrorMessage } from '@/utils/errorHandler'
import type { RideForm, Carona } from '@/types'
import { getMinDate } from '@/utils/dateHandler'

const router = useRouter()
const route = useRoute()
const vehicleStore = useVehicleStore()
const rideStore = useRideStore()

const rideId = computed(() => route.params.id ? Number(route.params.id) : null)
const isEditing = computed(() => !!rideId.value)

const form = ref<RideForm>({
  origin: '',
  destination: '',
  date: '',
  time: '',
  seats: 3,
  vehicleId: '',
  observation: ''
})

const isFetching = ref<Boolean>(false)
const hasVehicles = computed(() => vehicleStore.vehicles.length > 0)

onMounted(async () => {
  try {
    isFetching.value = true
    await vehicleStore.fetchVehicles()

    if (isEditing.value) {
      const response = await api.get<Carona>(`/rides/${rideId.value}`)
      const carona = response.data

      form.value = {
        origin: carona.origin,
        destination: carona.destination,
        date: carona.date,
        time: carona.time,
        seats: carona.seats,
        vehicleId: carona.vehicle.id,
        observation: carona.observation || ''
      }
    } else if (vehicleStore.vehicles.length > 0) {
      form.value.vehicleId = vehicleStore.vehicles[0]?.id ?? ''
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    toast.error('Não foi possível carregar as informações necessárias.')
    if (isEditing.value) router.push('/minhas-caronas')
  } finally {
    isFetching.value = false
  }
})

const handleSubmit = async () => {
  if (!form.value.vehicleId) {
    toast.warn('Por favor, selecione um veículo.')
    return
  }

  try {
    const payload = {
      origin: form.value.origin,
      destination: form.value.destination,
      date: form.value.date,
      time: form.value.time,
      seats: Number(form.value.seats),
      vehicleId: Number(form.value.vehicleId),
      observation: form.value.observation
    }

    if (isEditing.value) {
      await rideStore.updateRide(rideId.value!, payload)
      toast.success('Carona atualizada com sucesso!')
    } else {
      await rideStore.createRide(payload)
      toast.success('Carona publicada com sucesso!')
    }

    router.push('/minhas-caronas')
  }
  catch (error) {
    toast.error(getErrorMessage(error, 'Erro ao salvar carona.'))
  }
}
</script>

<template>
  <div class="space-y-6 w-full h-full">
    <button
      v-if="isEditing"
      @click="router.back()"
      class="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
    >
      <ArrowLeft :size="20" />
      Voltar
    </button>

    <div>
      <h1 class="text-3xl font-semibold text-gray-900">
        {{ isEditing ? 'Editar Carona' : 'Oferecer Carona' }}
      </h1>
      <p class="mt-2 text-gray-600">
        {{ isEditing ? 'Atualize os detalhes da sua viagem.' : 'Preencha os dados da viagem e compartilhe seu trajeto.' }}
      </p>
    </div>

    <div v-if="vehicleStore.isLoading || isFetching" class="flex flex-col items-center justify-center py-12 text-gray-500">
      <Loader2 class="mb-2 h-8 w-8 animate-spin text-blue-600" />
      <p>Carregando informações...</p>
    </div>

    <div v-else-if="!hasVehicles" class="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
      <AlertCircle :size="48" class="mx-auto text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">Você precisa de um veículo</h3>
      <p class="mt-1 text-sm text-gray-500">Para oferecer caronas, é necessário cadastrar um carro primeiro.</p>
      <div class="mt-6">
        <button @click="router.push('/meus-veiculos/novo')" class="text-sm font-medium text-blue-600 hover:underline">
          Cadastrar Veículo Agora
        </button>
      </div>
    </div>

    <div v-else class="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
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
              <option v-for="v in vehicleStore.vehicles" :key="v.id" :value="v.id">
                {{ v.brand }} {{ v.model }} ({{ v.plate }})
              </option>
            </select>
          </div>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <BaseInput id="origin" v-model="form.origin" label="Origem" required>
            <template #icon><MapPin :size="20" /></template>
          </BaseInput>
          <BaseInput id="destination" v-model="form.destination" label="Destino" required>
            <template #icon><MapPin :size="20" /></template>
          </BaseInput>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <BaseInput id="date" v-model="form.date" type="date" label="Data" required :min="getMinDate()">
            <template #icon><Calendar :size="20" /></template>
          </BaseInput>
          <BaseInput id="time" v-model="form.time" type="time" label="Horário" required>
            <template #icon><Clock :size="20" /></template>
          </BaseInput>
          <BaseInput id="seats" v-model="form.seats" type="number" label="Vagas" min="1" max="6" required>
            <template #icon><Users :size="20" /></template>
          </BaseInput>
        </div>

        <BaseInput id="observation" v-model="form.observation" type="textarea" label="Observações (Opcional)" rows="3">
          <template #icon><FileText :size="20" /></template>
        </BaseInput>

        <div class="pt-2">
          <BaseButton type="submit" class="w-full justify-center" :disabled="rideStore.isLoading">
            <span v-if="rideStore.isLoading" class="flex items-center gap-2">
               <Loader2 class="animate-spin h-4 w-4" /> Salvando...
            </span>
            <span v-else>{{ isEditing ? 'Salvar Alterações' : 'Publicar Carona' }}</span>
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>
