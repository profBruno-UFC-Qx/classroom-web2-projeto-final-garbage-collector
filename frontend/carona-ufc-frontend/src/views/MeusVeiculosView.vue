<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Plus, Trash2, Car } from 'lucide-vue-next'
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
  <div class="mx-auto w-[700px] px-4 py-8">

    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Meus Veículos</h1>
        <p class="mt-1 text-sm text-gray-600">Gerencie os carros que você usa para dar carona.</p>
      </div>

      <RouterLink to="/meus-veiculos/novo">
        <BaseButton size="sm" class="flex items-center gap-2">
          <Plus :size="18" />
          Novo Veículo
        </BaseButton>
      </RouterLink>
    </div>

    <div v-if="vehicleStore.isLoading" class="py-12 text-center text-gray-500">
      Carregando veículos...
    </div>

    <div v-else-if="vehicleStore.vehicles.length === 0" class="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
      <div class="mb-4 flex justify-center">
        <div class="rounded-full bg-gray-100 p-4">
          <Car class="h-8 w-8 text-gray-400" />
        </div>
      </div>
      <h3 class="text-lg font-medium text-gray-900">Nenhum veículo cadastrado</h3>
      <p class="mt-1 text-sm text-gray-500">Cadastre um carro para começar a oferecer caronas.</p>
      <div class="mt-6">
        <RouterLink to="/meus-veiculos/novo">
          <BaseButton variant="outline">Cadastrar agora</BaseButton>
        </RouterLink>
      </div>
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2">
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
</template>
