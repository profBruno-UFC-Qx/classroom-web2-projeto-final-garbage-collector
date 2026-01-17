<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Plus, Trash2, Car, Pencil } from 'lucide-vue-next'
import { useVehicleStore } from '@/stores/vehicle'
import BaseButton from '@/components/base/BaseButton.vue'

const vehicleStore = useVehicleStore()

onMounted(() => {
  vehicleStore.fetchVehicles()
})

const handleDelete = async (id: number) => {
  if (confirm('Tem certeza que deseja excluir este veículo?')) {
    await vehicleStore.removeVehicle(id)
  }
}
</script>

<template>
  <div class="space-y-6 w-full h-full">

    <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900">Meus Veículos</h1>
        <p class="mt-2 text-gray-600">Gerencie os carros que você usa para dar carona.</p>
      </div>

      <RouterLink to="/meus-veiculos/novo">
        <BaseButton class="flex items-center gap-2">
          <Plus :size="18" />
          Novo Veículo
        </BaseButton>
      </RouterLink>
    </div>

    <div v-if="vehicleStore.isLoading" class="flex flex-col items-center justify-center py-12 text-gray-500">
      <p>Carregando veículos...</p>
    </div>

    <div v-else-if="vehicleStore.vehicles.length === 0" class="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
      <Car :size="48" class="mx-auto text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum veículo cadastrado</h3>
      <p class="mt-1 text-sm text-gray-500">Cadastre um carro para começar a oferecer caronas.</p>
      <div class="mt-6">
        <RouterLink to="/meus-veiculos/novo" class="text-sm font-medium text-blue-600 hover:underline">
          Cadastrar agora
        </RouterLink>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="vehicle in vehicleStore.vehicles"
        :key="vehicle.id"
        class="relative flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
      >
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Car :size="24" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">{{ vehicle.brand }} {{ vehicle.model }}</h3>
            <p class="text-sm text-gray-500">{{ vehicle.color }} • {{ vehicle.plate }}</p>
          </div>
        </div>

        <div class="flex gap-2"> <RouterLink
            :to="`/meus-veiculos/editar/${vehicle.id}`"
            class="rounded-full p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
            title="Editar veículo"
          >
            <Pencil :size="18" />
          </RouterLink>

          <button
            @click="handleDelete(vehicle.id)"
            class="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
            title="Excluir veículo"
          >
            <Trash2 :size="18" />
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
