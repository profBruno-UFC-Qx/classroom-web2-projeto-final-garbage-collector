<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Car, Plus, Trash2, Edit2 } from 'lucide-vue-next'
import BaseButton from '@/components/base/BaseButton.vue'
import { RouterLink } from 'vue-router'
import type { Veiculo } from '@/types'

const veiculos = ref<Veiculo[]>([])
const isLoading = ref(true)

const fetchVeiculos = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))

  veiculos.value = [
    { id: 1, marca: 'Honda', modelo: 'Civic', cor: 'Prata', placa: 'ABC-1234' },
    { id: 2, marca: 'Fiat', modelo: 'Argo', cor: 'Branco', placa: 'XYZ-9876' }
  ]
  isLoading.value = false
}

const handleDelete = (id: number) => {
  if (confirm('Tem certeza que deseja remover este veículo?')) {
    veiculos.value = veiculos.value.filter(v => v.id !== id)
    console.log('API: Deletar veículo', id)
  }
}

onMounted(() => {
  fetchVeiculos()
})
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-6 w-[760px]">

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900">Meus Veículos</h1>
        <p class="mt-2 text-gray-600">Gerencie os carros que você usa para oferecer caronas.</p>
      </div>
      <RouterLink to="/meus-veiculos/novo">
        <BaseButton>
          <Plus :size="18" />
          Novo Veículo
        </BaseButton>
      </RouterLink>
    </div>

    <div v-if="isLoading" class="py-12 text-center text-gray-500">
      Carregando...
    </div>

    <div v-else>

      <div v-if="veiculos.length === 0" class="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <Car :size="48" class="mx-auto text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum veículo cadastrado</h3>
        <p class="mt-1 text-sm text-gray-500">
          Cadastre um veículo para começar a oferecer caronas.
        </p>
        <div class="mt-6">
          <RouterLink to="/meus-veiculos/novo">
            <BaseButton variant="secondary">Cadastrar Agora</BaseButton>
          </RouterLink>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          v-for="veiculo in veiculos"
          :key="veiculo.id"
          class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Car :size="24" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ veiculo.marca }} {{ veiculo.modelo }}</h3>
              <p class="text-sm text-gray-500">{{ veiculo.cor }} • {{ veiculo.placa }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button class="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="Editar">
              <Edit2 :size="18" />
            </button>
            <button
              @click="handleDelete(veiculo.id)"
              class="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
              title="Excluir"
            >
              <Trash2 :size="18" />
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
