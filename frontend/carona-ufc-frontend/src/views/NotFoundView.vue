<script setup lang="ts">
import { useRouter } from 'vue-router'
import { FileQuestion } from 'lucide-vue-next'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()

const handleBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="flex mt-[120px] flex-col items-center justify-center px-4 text-center">

    <div class="mb-6 rounded-full bg-blue-50 p-6">
      <FileQuestion class="h-16 w-16 text-blue-600" />
    </div>

    <h1 class="mb-2 text-3xl font-bold text-gray-900">Página não encontrada</h1>

    <p class="mb-8 max-w-md text-gray-600">
      Ops! A página que você está procurando não existe ou pode ter sido movida.
    </p>

    <BaseButton @click="handleBack" size="lg">
      Voltar para o Início
    </BaseButton>

  </div>
</template>
