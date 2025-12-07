<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Car, Plus } from 'lucide-vue-next'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import type { Veiculo } from '@/types'

const router = useRouter()

const veiculos = ref<Veiculo[]>([])
const isLoadingVehicles = ref(true)
const isSubmitting = ref(false)

const form = ref({
  veiculoId: '',
  origem: '',
  destino: '',
  data: '',
  horario: '',
  vagas: '' as number | string,
  observacoes: ''
})

const hasVehicles = computed(() => veiculos.value.length > 0)

const fetchVeiculos = async () => {
  isLoadingVehicles.value = true

  await new Promise(resolve => setTimeout(resolve, 600))

  veiculos.value = [
    { id: 1, marca: 'Honda', modelo: 'Civic', cor: 'Prata', placa: 'ABC-1234' },
    { id: 2, marca: 'Fiat', modelo: 'Argo', cor: 'Branco', placa: 'XYZ-9876' }
  ]

  if (veiculos.value.length > 0) {
    form.value.veiculoId = veiculos.value[0].id.toString()
  }

  isLoadingVehicles.value = false
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()

  if (!form.value.veiculoId) {
    alert('Por favor, selecione um veículo.')
    return
  }

  isSubmitting.value = true
  console.log('API: Criando carona (gratuita)...', form.value)

  await new Promise(resolve => setTimeout(resolve, 1000))

  isSubmitting.value = false
  alert('Carona solidária oferecida com sucesso!')
  router.push('/minhas-caronas')
}

onMounted(() => {
  fetchVeiculos()
})
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-8">

    <div class="rounded-lg bg-white p-6 shadow-sm">

      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Oferecer Carona
        </h1>
        <p class="mt-1 text-base text-gray-600">
          Ajude colegas oferecendo uma carona solidária e gratuita.
        </p>
      </div>

      <div v-if="isLoadingVehicles" class="py-8 text-center text-gray-500">
        Carregando informações...
      </div>

      <form v-else @submit="handleSubmit" class="space-y-6">

        <div>
          <label for="veiculo" class="mb-2 block text-sm font-medium text-gray-700">
            Veículo
          </label>

          <div v-if="!hasVehicles" class="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <Car :size="40" class="mx-auto text-gray-400" />
            <p class="mt-2 text-sm text-gray-600">
              Você ainda não cadastrou nenhum veículo
            </p>
            <button
              type="button"
              @click="router.push('/meus-veiculos/novo')"
              class="mt-4 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              <Plus :size="16" />
              Cadastrar Veículo
            </button>
          </div>

          <select
            v-else
            v-model="form.veiculoId"
            id="veiculo"
            name="veiculo"
            required
            class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option v-for="veiculo in veiculos" :key="veiculo.id" :value="veiculo.id">
              {{ veiculo.marca }} {{ veiculo.modelo }} - {{ veiculo.cor }} ({{ veiculo.placa }})
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label for="origem" class="mb-2 block text-sm font-medium text-gray-700">
              Origem
            </label>
            <select
              v-model="form.origem"
              id="origem"
              name="origem"
              required
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="" disabled selected>Selecione...</option>
              <option value="campus-qxd">Campus UFC - Quixadá</option>
              <option value="centro-qxd">Centro - Quixadá</option>
              <option value="rodoviaria-for">Fortaleza - Rodoviária</option>
            </select>
          </div>

          <div>
            <label for="destino" class="mb-2 block text-sm font-medium text-gray-700">
              Destino
            </label>
            <select
              v-model="form.destino"
              id="destino"
              name="destino"
              required
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="" disabled selected>Selecione...</option>
              <option value="campus-qxd">Campus UFC - Quixadá</option>
              <option value="centro-qxd">Centro - Quixadá</option>
              <option value="rodoviaria-for">Fortaleza - Rodoviária</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label for="data" class="mb-2 block text-sm font-medium text-gray-700">
              Data
            </label>
            <input
              v-model="form.data"
              type="date"
              id="data"
              name="data"
              required
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
          </div>

          <div>
            <label for="horario" class="mb-2 block text-sm font-medium text-gray-700">
              Horário
            </label>
            <input
              v-model="form.horario"
              type="time"
              id="horario"
              name="horario"
              required
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
          </div>
        </div>

        <div>
          <BaseInput
            v-model="form.vagas"
            id="vagas"
            label="Vagas Disponíveis"
            type="number"
            placeholder="Ex: 3"
            required
          />
        </div>

        <div>
          <label for="observacoes" class="mb-2 block text-sm font-medium text-gray-700">
            Observações (Opcional)
          </label>
          <textarea
            v-model="form.observacoes"
            id="observacoes"
            name="observacoes"
            rows="3"
            placeholder="Ponto de encontro, preferências, etc."
            class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <BaseButton
            type="submit"
            class="w-full"
            :disabled="!hasVehicles || isSubmitting"
          >
            {{ isSubmitting ? 'Processando...' : 'Oferecer Carona' }}
          </BaseButton>
        </div>
      </form>
    </div>

  </div>
</template>
