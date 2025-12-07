<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { ArrowLeft } from 'lucide-vue-next'

const router = useRouter()

const form = ref({
  marca: '',
  modelo: '',
  cor: '',
  placa: ''
})

const handleSubmit = async () => {
  console.log('Cadastrando veiculo...', form.value)

  await new Promise(resolve => setTimeout(resolve, 500))
  router.push('/meus-veiculos')
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">

    <button
      @click="router.back()"
      class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
    >
      <ArrowLeft :size="16" />
      Voltar para meus veículos
    </button>

    <div class="rounded-lg bg-white p-8 shadow-md">
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">Novo Veículo</h1>
        <p class="mt-1 text-gray-600">Preencha os dados do veículo que será utilizado.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <BaseInput
            v-model="form.marca"
            label="Marca"
            id="marca"
            placeholder="Ex: Honda"
            required
          />
          <BaseInput
            v-model="form.modelo"
            label="Modelo"
            id="modelo"
            placeholder="Ex: Civic"
            required
          />
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <BaseInput
            v-model="form.cor"
            label="Cor"
            id="cor"
            placeholder="Ex: Prata"
            required
          />
          <BaseInput
            v-model="form.placa"
            label="Placa"
            id="placa"
            placeholder="Ex: ABC-1234"
            required
          />
        </div>

        <div class="flex justify-end gap-3 border-t border-gray-100 pt-6">
          <BaseButton
            type="button"
            variant="secondary"
            @click="router.back()"
          >
            Cancelar
          </BaseButton>
          <BaseButton type="submit">
            Cadastrar Veículo
          </BaseButton>
        </div>

      </form>
    </div>
  </div>
</template>
