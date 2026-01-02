<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true

  try {
    await authStore.login(email.value, password.value)

    if (authStore.user?.role === 'admin') {
      toast.success('Bem-vindo, Administrador!')
      router.push('/admin')
    }
    else {
      toast.success('Bem-vindo!')
      router.push('/buscar-carona')
    }
  }
  catch (error: any) {
    const mensagem = error.response?.data?.message || 'Erro ao realizar login.'
    toast.error(mensagem)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="h-full w-full max-w-md rounded-lg bg-white p-8 shadow-md">

    <div class="text-center">
      <h2 class="text-2xl font-semibold text-gray-900">
        Acesse sua conta
      </h2>
      <p class="mt-2 text-sm text-gray-600">
        Bem-vindo de volta!
      </p>
    </div>

    <form class="mt-8 space-y-6" @submit.prevent="handleLogin">

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

      <div class="text-right text-sm">
        <a href="#" class="font-medium text-blue-600 hover:underline">
          Esqueceu sua senha?
        </a>
      </div>

      <div>
        <BaseButton type="submit">
          Entrar
        </BaseButton>
      </div>
    </form>

    <p class="mt-6 text-center text-sm text-gray-600">
      Não tem uma conta?
      <RouterLink to="/cadastro" class="font-medium text-blue-600 hover:underline">
        Cadastre-se
      </RouterLink>
    </p>
  </div>
</template>
