<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ShieldAlert } from 'lucide-vue-next'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()

const handleBack = () => {
  router.push('/buscar-carona')
}
</script>

<template>
  <div class="flex mt-[120px] flex-col items-center justify-center px-4 text-center">

    <div class="mb-6 rounded-full bg-red-50 p-6">
      <ShieldAlert class="h-16 w-16 text-red-600" />
    </div>

    <h1 class="mb-2 text-3xl font-bold text-gray-900">Acesso Restrito</h1>

    <p class="mb-8 max-w-md text-gray-600">
      Você não tem permissão para acessar esta página. Esta área é exclusiva para perfis de <strong>Motorista</strong>.
    </p>

    <BaseButton @click="handleBack" size="lg">
      Voltar para o Início
    </BaseButton>

  </div>
</template>
