<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-vue-next'
import BaseButton from '@/components/base/BaseButton.vue'
import api from '@/utils/api'
import { getErrorMessage } from '@/utils/errorHandler'

const route = useRoute()
const router = useRouter()

const status = ref<'loading' | 'success' | 'error' | 'sent'>('loading')
const message = ref('Processando...')
const sentEmailAddress = ref('')

onMounted(async () => {
  const token = route.query.token as string
  const mode = route.query.mode as string
  const email = route.query.email as string

  if (mode === 'sent') {
    status.value = 'sent'
    sentEmailAddress.value = email || 'seu e-mail'
    return
  }

  if (!token) {
    status.value = 'error'
    message.value = 'Link de verificação inválido ou incompleto.'
    return
  }

  status.value = 'loading'
  message.value = 'Validando seu token...'

  try {
    const response = await api.get(`/auth/verify-email?token=${token}`)

    status.value = 'success'
    message.value = response.data.message || 'E-mail verificado com sucesso!'

  } catch (error) {
    status.value = 'error'
    message.value = getErrorMessage(error, 'Falha ao verificar e-mail. O link pode ter expirado.')
  }
})

const goToLogin = () => router.push('/login')
</script>

<template>
  <div class="flex mt-[100px] flex-col items-center justify-center px-4 text-center">

    <div v-if="status === 'loading'" class="flex flex-col items-center">
      <Loader2 class="h-16 w-16 animate-spin text-blue-600 mb-6" />
      <h2 class="text-2xl font-semibold text-gray-900">Verificando...</h2>
      <p class="mt-2 text-gray-600">Aguarde um momento enquanto validamos seu cadastro.</p>
    </div>

    <div v-else-if="status === 'sent'" class="flex flex-col items-center max-w-md">
      <div class="mb-6 rounded-full bg-blue-50 p-6">
        <Mail class="h-16 w-16 text-blue-600" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900">Confirme seu E-mail</h2>
      <p class="mt-4 text-gray-600 leading-relaxed">
        Enviamos um link de confirmação para: <br/>
        <strong class="text-gray-900">{{ sentEmailAddress }}</strong>
      </p>
      <p class="mt-2 mb-8 text-sm text-gray-500">
        Verifique sua caixa de entrada (e a pasta de spam) e clique no link para ativar sua conta.
      </p>
      <BaseButton @click="goToLogin" variant="outline" class="w-full sm:w-auto">
        Voltar para Login
      </BaseButton>
    </div>

    <div v-else-if="status === 'success'" class="flex flex-col items-center max-w-md">
      <div class="mb-6 rounded-full bg-green-50 p-6">
        <CheckCircle class="h-16 w-16 text-green-600" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900">Conta Ativada!</h2>
      <p class="mt-2 mb-8 text-gray-600">
        Seu e-mail foi confirmado com sucesso. Agora você pode fazer login e aproveitar o sistema.
      </p>
      <BaseButton @click="goToLogin" size="lg" class="w-full sm:w-auto">
        Ir para o Login
      </BaseButton>
    </div>

    <div v-else class="flex flex-col items-center max-w-md">
      <div class="mb-6 rounded-full bg-red-50 p-6">
        <XCircle class="h-16 w-16 text-red-600" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900">Link Inválido</h2>
      <p class="mt-2 mb-8 text-gray-600">{{ message }}</p>

      <div class="flex flex-col gap-3 w-full sm:w-auto">
        <BaseButton @click="goToLogin" variant="outline">
          Voltar para Login
        </BaseButton>
      </div>
    </div>

  </div>
</template>
