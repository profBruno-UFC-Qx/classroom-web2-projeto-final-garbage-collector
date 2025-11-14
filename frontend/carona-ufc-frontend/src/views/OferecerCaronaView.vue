<script setup lang="ts">
import { ref } from 'vue'
import { Car, Plus } from 'lucide-vue-next'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const hasVehicles = ref(false)

const veiculo = ref('')
const origem = ref('')
const destino = ref('')
const data = ref('')
const horario = ref('')
const vagas = ref<number | string>('')
const valor = ref('')
const observacoes = ref('')

const handleSubmit = (e: Event) => {
  e.preventDefault()
  console.log('Oferecer carona:', {
    veiculo: veiculo.value,
    origem: origem.value,
    destino: destino.value,
    data: data.value,
    horario: horario.value,
    vagas: vagas.value,
    valor: valor.value,
    observacoes: observacoes.value,
  })
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-8">

    <div class="rounded-lg bg-white p-6 shadow-sm">

      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Oferecer Carona
        </h1>
        <p class="mt-1 text-base text-gray-600">
          Ajude colegas oferecendo uma carona solidária
        </p>
      </div>

      <form @submit="handleSubmit" class="space-y-6">

        <!-- Veículo -->
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
              class="mt-4 inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              <Plus :size="16" />
              Cadastrar Veículo
            </button>
          </div>

          <select
            v-else
            v-model="veiculo"
            id="veiculo"
            name="veiculo"
            class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="" disabled selected>Selecione um veículo</option>
            <option value="civic">Honda Civic - Prata (ABC-1234)</option>
            <option value="argo">Fiat Argo - Branco (XYZ-9876)</option>
          </select>
        </div>

        <!-- Origem e Destino -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label for="origem" class="mb-2 block text-sm font-medium text-gray-700">
              Origem
            </label>
            <select
              v-model="origem"
              id="origem"
              name="origem"
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
              v-model="destino"
              id="destino"
              name="destino"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="" disabled selected>Selecione...</option>
              <option value="campus-qxd">Campus UFC - Quixadá</option>
              <option value="centro-qxd">Centro - Quixadá</option>
              <option value="rodoviaria-for">Fortaleza - Rodoviária</option>
            </select>
          </div>
        </div>

        <!-- Data e Horário -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label for="data" class="mb-2 block text-sm font-medium text-gray-700">
              Data
            </label>
            <input
              v-model="data"
              type="date"
              id="data"
              name="data"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
          </div>

          <div>
            <label for="horario" class="mb-2 block text-sm font-medium text-gray-700">
              Horário
            </label>
            <input
              v-model="horario"
              type="time"
              id="horario"
              name="horario"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
          </div>
        </div>

        <!-- Vagas Disponíveis -->
        <div>
          <BaseInput
            v-model="vagas"
            id="vagas"
            label="Vagas Disponíveis"
            type="number"
            placeholder="Ex: 3"
          />
        </div>

        <!-- Observações -->
        <div>
          <label for="observacoes" class="mb-2 block text-sm font-medium text-gray-700">
            Observações (Opcional)
          </label>
          <textarea
            v-model="observacoes"
            id="observacoes"
            name="observacoes"
            rows="3"
            placeholder="Ponto de encontro, preferências, etc."
            class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Botão Submit -->
        <div>
          <BaseButton type="submit" :disabled="!hasVehicles">
            Oferecer Carona
          </BaseButton>
        </div>
      </form>
    </div>

    <!-- Minhas Caronas -->
    <div class="rounded-lg bg-white p-6 shadow-sm">
      <h2 class="text-2xl font-bold text-gray-900">
        Minhas Caronas Oferecidas
      </h2>
      <div class="mt-6 rounded-lg border border-dashed border-gray-300 p-8 text-center">
        <p class="text-sm text-gray-500">Nenhuma carona ativa no momento.</p>
      </div>
    </div>

  </div>
</template>
