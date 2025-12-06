<script setup lang="ts">
import { ref } from 'vue'
import { Star, CheckSquare, Square } from 'lucide-vue-next'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import UserAvatarUpload from '@/components/profile/UserAvatarUpload.vue'

const userRole = ref<'passageiro' | 'motorista'>('passageiro')
const activeTab = ref<'dados' | 'configuracoes'>('dados')

// Dados do Usuário
const nomeCompleto = ref('João Silva')
const email = ref('joao.silva@alu.ufc.br')
const fotoPerfil = ref<string>("https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg")

// Estatísticas
const avaliacao = ref(4.8)
const totalCaronas = ref(15)

// Configurações de privacidade
const mostrarTelefone = ref(true)
const receberNotificacoes = ref(true)

// Upload de Foto
const handleImageUpdate = (file: File) => {
  console.log('Enviando foto...', file)
  // await api.uploadAvatar(file)
}

// Salvar Dados Pessoais
const updateProfileData = () => {
  console.log('Atualizando perfil...', {
    nome: nomeCompleto.value,
  })
}

// Atualizar Configurações (Auto-save)
const togglePrivacy = (field: 'telefone' | 'notificacoes') => {
  if (field === 'telefone') mostrarTelefone.value = !mostrarTelefone.value
  if (field === 'notificacoes') receberNotificacoes.value = !receberNotificacoes.value

  console.log('Salvando preferência...', field)
}

</script>

<template>
  <div class="space-y-6 h-[700px]">

    <div>
      <h1 class="text-3xl font-semibold text-gray-900">Meu Perfil</h1>
      <p class="mt-2 text-gray-600">Gerencie suas informações e preferências</p>
    </div>

    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">

      <aside class="md:col-span-1">
        <div class="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-md h-full">

          <div class="mx-auto mb-4">
            <UserAvatarUpload
              :src="fotoPerfil"
              :alt="nomeCompleto"
              size="h-28 w-28"
              @update:image="handleImageUpdate"
            />
          </div>

          <h2 class="mt-4 text-xl font-semibold text-gray-900">{{ nomeCompleto }}</h2>

          <p class="text-sm text-gray-500">{{ email }}</p>

          <span
            :class="[
              'mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium',
              userRole === 'motorista' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'
            ]"
          >
            {{ userRole === 'motorista' ? 'Motorista' : 'Passageiro' }}
          </span>

          <div class="mt-6 border-t border-gray-100 pt-4 text-left">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Avaliação</span>
              <span class="flex items-center gap-1 font-medium text-gray-900">
                <Star :size="16" class="fill-amber-400 text-amber-400" />
                {{ avaliacao }}
              </span>
            </div>
            <div class="mt-2 flex items-center justify-between text-sm">
              <span class="text-gray-600">Caronas realizadas</span>
              <span class="font-medium text-gray-900">{{ totalCaronas }}</span>
            </div>
          </div>
        </div>
      </aside>

      <main class="md:col-span-2">
        <div class="mb-6 flex space-x-1 rounded-lg bg-gray-100 p-1">
          <button
            @click="activeTab = 'dados'"
            :class="[
              'w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors',
              activeTab === 'dados' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-200'
            ]"
          >
            Dados
          </button>
          <button
            @click="activeTab = 'configuracoes'"
            :class="[
              'w-full rounded-md px-3 py-2 text-center text-sm font-medium transition-colors',
              activeTab === 'configuracoes' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-200'
            ]"
          >
            Configurações
          </button>
        </div>

        <div class="w-[500px]">

          <div v-if="activeTab === 'dados'" class="rounded-lg border border-gray-200 bg-white shadow-md">
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-900">Informações Pessoais</h3>
              <p class="mt-1 text-sm text-gray-600">Atualize seus dados cadastrais.</p>
            </div>

            <form class="space-y-6 border-t border-gray-200 p-6" @submit.prevent="updateProfileData">
              <BaseInput
                v-model="nomeCompleto"
                label="Nome Completo"
                id="nomeCompleto"
                type="text"
              />

              <div>
                <BaseInput
                  v-model="email"
                  id="email"
                  label="E-mail Institucional"
                  type="email"
                  disabled
                />
                <p class="mt-2 text-xs text-gray-500">O e-mail não pode ser alterado.</p>
              </div>

              <div class="text-right">
                <BaseButton type="submit">
                  Salvar Alterações
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

              <div v-if="userRole === 'passageiro'" class="p-6">
                <div class="flex items-start gap-4">
                  <div class="flex-1">
                    <h3 class="text-base font-medium text-gray-900">Tornar-se Motorista</h3>
                    <p class="mt-1 text-sm text-gray-600">
                      Comece a oferecer caronas para a comunidade.
                    </p>
                    <p class="mt-2 text-sm text-gray-600">
                      Para se tornar motorista, você precisa cadastrar pelo menos um veículo.
                    </p>
                    <BaseButton type="button" class="mt-4">
                      Solicitar Cadastro como Motorista
                    </BaseButton>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <h3 class="text-base font-medium text-gray-900">Privacidade</h3>
                <p class="mt-1 text-sm text-gray-600">Configure suas preferências de privacidade</p>
                <div class="mt-4 space-y-4">

                  <div @click="togglePrivacy('telefone')" class="flex cursor-pointer items-start gap-3 select-none">
                    <component :is="mostrarTelefone ? CheckSquare : Square" :size="20" class="mt-0.5 text-blue-600" />
                    <div>
                      <h4 class="font-medium text-gray-800">Mostrar telefone no perfil</h4>
                      <p class="text-sm text-gray-600">Outros usuários poderão ver seu número.</p>
                    </div>
                  </div>

                  <div @click="togglePrivacy('notificacoes')" class="flex cursor-pointer items-start gap-3 select-none">
                    <component :is="receberNotificacoes ? CheckSquare : Square" :size="20" class="mt-0.5 text-blue-600" />
                    <div>
                      <h4 class="font-medium text-gray-800">Receber notificações por e-mail</h4>
                      <p class="text-sm text-gray-600">Sobre novas caronas e solicitações.</p>
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
