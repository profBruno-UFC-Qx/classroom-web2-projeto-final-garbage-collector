<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Star, CheckSquare, Square, Loader2 } from 'lucide-vue-next'
import { toast } from 'vue3-toastify'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import UserAvatarUpload from '@/components/profile/UserAvatarUpload.vue'
import api from '@/utils/api'
import { useAuthStore } from '@/stores/auth'
import { getErrorMessage } from '@/utils/errorHandler'
import type { User } from '@/types'

import defaultAvatarImg from '@/assets/images/profile.png'

const avatarUploadRef = ref<InstanceType<typeof UserAvatarUpload> | null>(null)
const authStore = useAuthStore()
const isLoading = ref(false)
const isSaving = ref(false)
const activeTab = ref<'dados' | 'configuracoes'>('dados')

const originalForm = ref<User | null>(null)

const form = ref<User>({
  id: 0,
  name: '',
  email: '',
  phone: '',
  role: 'passageiro',
  avatar: '',
  rating: 0,
  showPhone: false,
  emailNotifications: false
})

const totalCaronas = ref(0)

const hasChanges = computed(() => {
  if (!originalForm.value) return false

  const nameChanged = form.value.name !== originalForm.value.name
  const phoneChanged = form.value.phone !== originalForm.value.phone

  return nameChanged || phoneChanged
})

const fetchProfile = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/users/me')
    const userData = response.data

    if (!userData.avatar) {
      userData.avatar = defaultAvatarImg
    }

    userData.phone = userData.phone || ''

    authStore.updateUser(userData)

    form.value = { ...userData }

    originalForm.value = { ...userData }
  }
  catch (error) {
    console.error('Erro ao carregar perfil:', error)
    toast.error(getErrorMessage(error, 'Não foi possível carregar seus dados.'))
  }
  finally {
    isLoading.value = false
  }
}

const updateProfileData = async () => {
  if (!hasChanges.value) return

  try {
    isSaving.value = true

    const response = await api.put('/users/', {
      name: form.value.name,
      phone: form.value.phone
    })

    const updatedUser = response.data.user || { name: form.value.name, phone: form.value.phone }

    authStore.updateUser(updatedUser)

    if (originalForm.value) {
      originalForm.value.name = form.value.name
      originalForm.value.phone = form.value.phone
    }

    toast.success('Dados atualizados com sucesso!')
  }
  catch (error) {
    console.error('Erro ao atualizar:', error)
    toast.error(getErrorMessage(error, 'Erro ao salvar alterações.'))
  }
  finally {
    isSaving.value = false
  }
}

const togglePrivacy = async (field: 'showPhone' | 'emailNotifications') => {
  const previousState = form.value[field]

  try {
    form.value[field] = !previousState

    await api.put('/users/', { [field]: form.value[field] })

    authStore.updateUser({ [field]: form.value[field] })

    if (originalForm.value) {
        originalForm.value[field] = form.value[field]
    }
  }
  catch (error) {
    form.value[field] = previousState
    console.error('Erro ao salvar configuração:', error)
    toast.error(getErrorMessage(error, 'Não foi possível salvar a configuração.'))
  }
}

const handleImageUpdate = async (file: File) => {
  let idToast: any = null

  try {
    const formData = new FormData()
    formData.append('avatar', file)

    idToast = toast.loading("Enviando imagem...", { transition: 'slide' })

    const response = await api.patch('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    const newAvatarUrl = response.data.user.avatar

    form.value.avatar = newAvatarUrl
    authStore.updateUser({ avatar: newAvatarUrl })

    if(originalForm.value) originalForm.value.avatar = newAvatarUrl

    toast.update(idToast, {
      render: "Foto de perfil atualizada!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
      transition: 'slide'
    })

  } catch (error) {
    console.error('Erro no upload:', error)

    if (avatarUploadRef.value) {
      avatarUploadRef.value.resetPreview()
    }

    if (idToast) toast.remove(idToast)
    toast.error(getErrorMessage(error, 'Falha ao enviar imagem. Verifique o tamanho ou formato.'))
  }
}

const handleBecomeDriver = async () => {
  if (!confirm('Deseja solicitar o cadastro como motorista?')) return

  try {
    isSaving.value = true
    const response = await api.patch('/users/become-driver')

    const { user: updatedUser, token: newToken } = response.data

    form.value.role = updatedUser.role
    authStore.updateUser({ role: updatedUser.role })

    if(originalForm.value) originalForm.value.role = updatedUser.role

    if (newToken) {
      authStore.setToken(newToken)
    }

    toast.success(response.data.message)

  }
  catch (error) {
    console.error(error)
    toast.error(getErrorMessage(error, 'Erro ao processar solicitação.'))
  }
  finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <div class="space-y-6 h-[700px]">

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900">Meu Perfil</h1>
        <p class="mt-2 text-gray-600">Gerencie suas informações e preferências</p>
      </div>
      <div v-if="isLoading" class="text-blue-600">
        <Loader2 class="animate-spin h-8 w-8" />
      </div>
    </div>

    <div v-if="!isLoading" class="grid grid-cols-1 gap-8 md:grid-cols-3">

      <aside class="md:col-span-1 w-[260px]">
        <div class="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-md h-full">
          <div class="mx-auto mb-4">
            <UserAvatarUpload
              ref="avatarUploadRef"
              :src="authStore.user?.avatar || defaultAvatarImg"
              :alt="authStore.user?.name"
              size="h-28 w-28"
              @update:image="handleImageUpdate"
            />
          </div>

          <h2 class="mt-4 text-xl font-semibold text-gray-900">{{ authStore.user?.name }}</h2>
          <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>

          <span :class="['mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium', authStore.user?.role === 'motorista' ? 'bg-gray-800 text-white' : 'bg-blue-100 text-blue-700']">
            {{ authStore.user?.role === 'motorista' ? 'Motorista' : 'Passageiro' }}
          </span>

          <div class="mt-6 border-t border-gray-100 pt-4 text-left">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Avaliação</span>
              <span class="flex items-center gap-1 font-medium text-gray-900">
                <Star :size="16" class="fill-amber-400 text-amber-400" /> {{ authStore.user?.rating || 'N/A' }}
              </span>
            </div>

            <div class="mt-2 flex items-center justify-between text-sm">
              <span class="text-gray-600">Total de caronas</span>
              <span class="font-medium text-gray-900">{{ totalCaronas }}</span>
            </div>
          </div>
        </div>
      </aside>

      <main class="md:col-span-2">
        <div class="mb-6 flex space-x-1 rounded-lg bg-gray-100 p-1">
          <button @click="activeTab = 'dados'" :class="['w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors', activeTab === 'dados' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-200']">
            Dados
          </button>
          <button @click="activeTab = 'configuracoes'" :class="['w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors', activeTab === 'configuracoes' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-200']">
            Configurações
          </button>
        </div>

        <div class="w-full">

          <div v-if="activeTab === 'dados'" class="rounded-lg border border-gray-200 bg-white shadow-md">
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-900">Informações Pessoais</h3>
              <p class="mt-1 text-sm text-gray-600">Atualize seus dados cadastrais.</p>
            </div>

            <form class="space-y-6 border-t border-gray-200 p-6" @submit.prevent="updateProfileData">
              <BaseInput
                v-model="form.name"
                label="Nome Completo"
                id="nomeCompleto"
                type="text"
                required
              />

              <BaseInput
                v-model="form.phone"
                label="Telefone / WhatsApp"
                id="phone"
                type="tel"
                placeholder="(85) 99999-9999"
                v-maska
                data-maska="['(##) ####-####', '(##) #####-####']"
              />

              <div>
                <BaseInput
                  v-model="form.email"
                  id="email"
                  label="E-mail Institucional"
                  type="email"
                  disabled
                />
                <p class="mt-2 text-xs text-gray-500">O e-mail não pode ser alterado.</p>
              </div>

              <div class="text-right">
                <BaseButton type="submit" :disabled="!hasChanges || isSaving">
                  <span v-if="isSaving" class="flex items-center gap-2">
                    <Loader2 class="animate-spin h-4 w-4" /> Salvando...
                  </span>
                  <span v-else>Salvar Alterações</span>
                </BaseButton>
              </div>
            </form>
          </div>

          <div v-if="activeTab === 'configuracoes'" class="rounded-lg border border-gray-200 bg-white shadow-md">
             <div class="p-6">
              <h3 class="text-lg font-medium text-gray-900">Configurações da Conta</h3>
              <p class="mt-1 text-sm text-gray-600">Preferências e privacidade.</p>
            </div>

            <div class="space-y-0 divide-y divide-gray-200 border-t border-gray-200">

              <div v-if="authStore.user?.role === 'passageiro'" class="p-6">
                <div class="flex items-start gap-4">
                  <div class="flex-1">
                    <h3 class="text-base font-medium text-gray-900">Tornar-se Motorista</h3>
                    <p class="mt-1 text-sm text-gray-600">Comece a oferecer caronas para a comunidade.</p>
                    <BaseButton type="button" class="mt-4" variant="outline" @click="handleBecomeDriver" :disabled="isSaving">
                      Solicitar Cadastro como Motorista
                    </BaseButton>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <h3 class="text-base font-medium text-gray-900">Privacidade</h3>
                <p class="mt-1 text-sm text-gray-600">Configure suas preferências</p>
                <div class="mt-4 space-y-4">

                  <div @click="togglePrivacy('showPhone')" class="flex cursor-pointer items-start gap-3 select-none hover:bg-gray-50 p-2 rounded-md transition">
                    <component :is="form.showPhone ? CheckSquare : Square" :size="20" :class="form.showPhone ? 'text-blue-600' : 'text-gray-400'" class="mt-0.5" />
                    <div>
                      <h4 class="font-medium text-gray-800">Mostrar telefone no perfil</h4>
                      <p class="text-sm text-gray-600">Outros usuários poderão ver seu número nas caronas.</p>
                    </div>
                  </div>

                  <div @click="togglePrivacy('emailNotifications')" class="flex cursor-pointer items-start gap-3 select-none hover:bg-gray-50 p-2 rounded-md transition">
                    <component :is="form.emailNotifications ? CheckSquare : Square" :size="20" :class="form.emailNotifications ? 'text-blue-600' : 'text-gray-400'" class="mt-0.5" />
                    <div>
                      <h4 class="font-medium text-gray-800">Receber notificações por e-mail</h4>
                      <p class="text-sm text-gray-600">Sobre novas caronas e atualizações de status.</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>
