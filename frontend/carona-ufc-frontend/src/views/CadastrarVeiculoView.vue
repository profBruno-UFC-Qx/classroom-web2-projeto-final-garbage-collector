<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { useVehicleStore } from '@/stores/vehicle'
import { toast } from 'vue3-toastify'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()
const vehicleStore = useVehicleStore()

const brand = ref('')
const model = ref('')
const color = ref('')
const plate = ref('')
const isLoading = ref(false)

const handlePlateInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  plate.value = target.value.toUpperCase().replace(/\s/g, '')
}

const handleSubmit = async () => {
  isLoading.value = true
  try {
    await vehicleStore.addVehicle({
      brand: brand.value,
      model: model.value,
      color: color.value,
      plate: plate.value
    })

    toast.success('Veículo cadastrado com sucesso!')
    router.push('/meus-veiculos')
  } catch (error) {
    // Erro já tratado na store (toast)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-xl px-4 py-8">

    <button
      @click="router.back()"
      class="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
    >
      <ArrowLeft :size="20" />
      Voltar para meus veículos
    </button>

    <div class="rounded-lg bg-white p-8 shadow-sm border border-gray-100">
      <h1 class="text-2xl font-bold text-gray-900">Novo Veículo</h1>
      <p class="mt-1 text-sm text-gray-600">Preencha os dados do carro.</p>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">

        <div class="grid gap-6 sm:grid-cols-2">
          <BaseInput
            v-model="brand"
            label="Marca"
            id="marca"
            placeholder="Ex: Honda"
            required
          />
          <BaseInput
            v-model="model"
            label="Modelo"
            id="modelo"
            placeholder="Ex: Civic"
            required
          />
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          <BaseInput
            v-model="color"
            label="Cor"
            id="cor"
            placeholder="Ex: Prata"
            required
          />
          <BaseInput
            v-model="plate"
            label="Placa"
            placeholder="ABC1234"
            id="placa"
            required
            @input="handlePlateInput"
            maxlength="7"
          />
        </div>

        <div class="pt-4">
          <BaseButton type="submit" class="w-full" :disabled="isLoading">
            {{ isLoading ? 'Salvando...' : 'Cadastrar Veículo' }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>
