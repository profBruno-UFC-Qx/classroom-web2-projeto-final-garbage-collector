<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

import { useAdminStore } from '@/stores/admin'
import { Users, Car, Search, Trash2, Ban, CheckCircle } from 'lucide-vue-next'
import BaseInput from '@/components/base/BaseInput.vue'

const adminStore = useAdminStore()
const activeTab = ref<'users' | 'rides'>('users')
const search = ref('')

const headersUsers = [
  { text: "ID", value: "id", sortable: true, width: 50 },
  { text: "Nome", value: "name", sortable: true },
  { text: "Email", value: "email", sortable: true },
  { text: "Perfil", value: "role", sortable: true },
  { text: "Status", value: "isActive", sortable: true },
  { text: "Ações", value: "actions", width: 100 },
]

const headersRides = [
  { text: "ID", value: "id", sortable: true, width: 50 },
  { text: "Motorista", value: "driver.name", sortable: true },
  { text: "Origem", value: "origin", sortable: true },
  { text: "Destino", value: "destination", sortable: true },
  { text: "Data", value: "date", sortable: true },
  { text: "Status", value: "status", sortable: true },
  { text: "Ações", value: "actions", width: 100 },
]

const statusMap: Record<string, { label: string; class: string }> = {
  open: { label: 'Aberta', class: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelada', class: 'bg-red-100 text-red-800' },
  finished: { label: 'Finalizada', class: 'bg-blue-100 text-blue-800' },
  full: { label: 'Lotada', class: 'bg-orange-100 text-orange-800' },
}

onMounted(() => {
  adminStore.fetchUsers()
  adminStore.fetchRides()
})

const handleToggleStatus = async (user: any) => {
  const action = user.isActive ? 'desativar' : 'ativar'
  if (confirm(`Tem certeza que deseja ${action} o usuário ${user.name}?`)) {
    await adminStore.toggleUserStatus(user)
  }
}

const handleCancelRide = async (ride: any) => {
  if (confirm(`Deseja realmente cancelar a carona de ${ride.driver.name}?`)) {
    await adminStore.cancelRide(ride.id)
  }
}
</script>

<template>
  <div class="w-full space-y-6">

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900">Painel Administrativo</h1>
        <p class="mt-2 text-gray-600">Gerencie usuários e monitore as caronas do sistema.</p>
      </div>
    </div>

    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="activeTab = 'users'"
          :class="[
            activeTab === 'users' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700',
            'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
          ]"
        >
          <Users class="-ml-0.5 mr-2 h-5 w-5" />
          <span>Usuários</span>
        </button>

        <button
          @click="activeTab = 'rides'"
          :class="[
            activeTab === 'rides' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700',
            'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
          ]"
        >
          <Car class="-ml-0.5 mr-2 h-5 w-5" />
          <span>Caronas</span>
        </button>
      </nav>
    </div>

    <div class="max-w-md">
      <BaseInput v-model="search" placeholder="Buscar na tabela...">
        <template #icon><Search :size="18" /></template>
      </BaseInput>
    </div>

    <div v-if="activeTab === 'users'" class="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <Vue3EasyDataTable
        :headers="headersUsers"
        :items="adminStore.users"
        :search-value="search"
        :loading="adminStore.isLoading"

        :rows-items="[5, 10, 25, 50]"
        :rows-per-page="10"

        buttons-pagination
        alternating
        rows-per-page-message="Linhas por página:"
        rows-of-page-separator-message="de"
        empty-message="Nenhum usuário encontrado"
      >
        <template #item-isActive="item">
          <span
            class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
            :class="item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
          >
            {{ item.isActive ? 'Ativo' : 'Inativo' }}
          </span>
        </template>

        <template #item-role="item">
           <span class="capitalize">{{ item.role }}</span>
        </template>

        <template #item-actions="item">
          <div class="flex gap-2" v-if="item.role !== 'admin'">
            <button
              @click="handleToggleStatus(item)"
              class="p-1 rounded hover:bg-gray-100 transition-colors"
              :title="item.isActive ? 'Desativar Conta' : 'Ativar Conta'"
            >
              <Ban v-if="item.isActive" :size="18" class="text-red-600" />
              <CheckCircle v-else :size="18" class="text-green-600" />
            </button>
          </div>
          <span v-else class="text-xs text-gray-400 italic">Admin</span>
        </template>
      </Vue3EasyDataTable>
    </div>

    <div v-if="activeTab === 'rides'" class="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <Vue3EasyDataTable
        :headers="headersRides"
        :items="adminStore.rides"
        :search-value="search"
        :loading="adminStore.isLoading"

        :rows-items="[5, 10, 25, 50]"
        :rows-per-page="10"

        buttons-pagination
        alternating
        empty-message="Nenhuma carona encontrada"
        rows-per-page-message="Linhas por página:"
        rows-of-page-separator-message="de"
      >
        <template #item-driver.name="item">
           <div class="font-medium text-gray-900">{{ item.driver.name }}</div>
           <div class="text-xs text-gray-500">{{ item.driver.email }}</div>
        </template>

        <template #item-date="item">
          {{ item.date.split('-').reverse().join('/') }} às {{ item.time }}
        </template>

        <template #item-status="item">
          <span
            class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
            :class="statusMap[item.status]?.class || 'bg-gray-100 text-gray-800'"
          >
            {{ statusMap[item.status]?.label || item.status }}
          </span>
        </template>

        <template #item-actions="item">
          <button
            v-if="['open', 'full'].includes(item.status)"
            @click="handleCancelRide(item)"
            class="p-1 rounded hover:bg-red-50 transition-colors text-red-600"
            title="Cancelar Carona"
          >
            <Ban :size="18" />
          </button>
        </template>
      </Vue3EasyDataTable>
    </div>

  </div>
</template>

<style>
.vue3-easy-data-table {
  --easy-table-border: 1px solid #e5e7eb;
  --easy-table-row-border: 1px solid #e5e7eb;
  --easy-table-header-font-size: 0.875rem;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: #374151;
  --easy-table-header-background-color: #f9fafb;
  --easy-table-body-row-hover-background-color: #f3f4f6;
}
</style>
