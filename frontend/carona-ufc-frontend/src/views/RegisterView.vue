<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    toast.warning('As senhas não conferem!')
    return
  }

  isLoading.value = true

  try {
    await authStore.register(fullName.value, email.value, password.value)

    router.push({
      name: 'verify-email',
      query: {
        email: email.value,
        mode: 'sent'
      }
    })

  }
  catch (error: any) {
    const data = error.response?.data

    if (data?.errors && Array.isArray(data.errors)) {
      toast.error(data.errors[0])
    } else {
      toast.error(data?.message || 'Erro ao criar conta.')
    }
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex h-full w-full items-center justify-center">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">

      <div class="text-center">
        <h2 class="text-2xl font-semibold text-gray-900">
          Crie sua conta
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Junte-se à comunidade Carona UFC!
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">

        <BaseInput
          v-model="fullName"
          label="Nome Completo"
          id="fullName"
          type="text"
          placeholder="Seu nome completo"
          required
        />

        <BaseInput
          v-model="email"
          label="Email Institucional"
          id="email"
          type="email"
          placeholder="seu.email@aluno.ufc.br"
          required
        />

        <BaseInput
          v-model="password"
          label="Senha"
          id="password"
          type="password"
          placeholder="••••••••"
          required
        />

        <BaseInput
          v-model="confirmPassword"
          label="Confirmar Senha"
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
        />

        <div>
          <BaseButton type="submit" class="w-full" :disabled="isLoading">
            {{ isLoading ? 'Criando conta...' : 'Criar conta' }}
          </BaseButton>
        </div>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        Já tem uma conta?
        <RouterLink to="/login" class="font-medium text-blue-600 hover:underline">
          Entrar
        </RouterLink>
      </p>
    </div>
  </div>
</template>
