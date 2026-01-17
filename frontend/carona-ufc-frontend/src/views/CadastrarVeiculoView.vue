<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Loader2 } from 'lucide-vue-next'
import { useVehicleStore } from '@/stores/vehicle'
import { toast } from 'vue3-toastify'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()
const route = useRoute()
const vehicleStore = useVehicleStore()

const vehicleId = computed(() => route.params.id ? Number(route.params.id) : null)
const isEditing = computed(() => !!vehicleId.value)

const brand = ref('')
const model = ref('')
const color = ref('')
const plate = ref('')
const isLoading = ref(false)
const isFetching = ref(false)

onMounted(async () => {
  if (isEditing.value) {
    isFetching.value = true
    try {
      if (vehicleStore.vehicles.length === 0) {
        await vehicleStore.fetchVehicles()
      }

      const vehicle = vehicleStore.vehicles.find(v => v.id === vehicleId.value)

      if (vehicle) {
        brand.value = vehicle.brand
        model.value = vehicle.model
        color.value = vehicle.color
        plate.value = vehicle.plate
      } else {
        toast.error('Veículo não encontrado.')
        router.push('/meus-veiculos')
      }
    } finally {
      isFetching.value = false
    }
  }
})

const handlePlateInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  plate.value = target.value.toUpperCase().replace(/\s/g, '')
}

const handleSubmit = async () => {
  isLoading.value = true
  try {
    const payload = {
      brand: brand.value,
      model: model.value,
      color: color.value,
      plate: plate.value
    }

    if (isEditing.value) {
      await vehicleStore.updateVehicle(vehicleId.value!, payload)
      toast.success('Veículo atualizado com sucesso!')
    } else {
      await vehicleStore.addVehicle(payload)
      toast.success('Veículo cadastrado com sucesso!')
    }

    router.push('/meus-veiculos')
  } catch (error) {
    // Erros já tratados na store
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-xl px-4 py-8">
    <button
      @click="router.push('/meus-veiculos')"
      class="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
    >
      <ArrowLeft :size="20" />
      Voltar para meus veículos
    </button>

    <div class="rounded-lg bg-white p-8 shadow-sm border border-gray-100">
      <div v-if="isFetching" class="flex flex-col items-center py-10">
        <Loader2 class="animate-spin text-blue-600 mb-2" />
        <p class="text-gray-500">Carregando dados...</p>
      </div>

      <template v-else>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isEditing ? 'Editar Veículo' : 'Novo Veículo' }}
        </h1>
        <p class="mt-1 text-sm text-gray-600">
          {{ isEditing ? 'Atualize as informações do seu carro.' : 'Preencha os dados do carro.' }}
        </p>

        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <div class="grid gap-6 sm:grid-cols-2">
            <BaseInput v-model="brand" label="Marca" id="marca" required />
            <BaseInput v-model="model" label="Modelo" id="modelo" required />
          </div>

          <div class="grid gap-6 sm:grid-cols-2">
            <BaseInput v-model="color" label="Cor" id="cor" required />
            <BaseInput
              v-model="plate"
              label="Placa"
              id="placa"
              required
              @input="handlePlateInput"
              maxlength="7"
            />
          </div>

          <div class="pt-4">
            <BaseButton type="submit" class="w-full" :disabled="isLoading">
              {{ isLoading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Cadastrar Veículo') }}
            </BaseButton>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>
