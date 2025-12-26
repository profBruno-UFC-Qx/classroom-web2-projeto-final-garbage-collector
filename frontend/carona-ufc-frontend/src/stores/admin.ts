import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'
import { toast } from 'vue3-toastify'
import { getErrorMessage } from '@/utils/errorHandler'
import type { User, Carona } from '@/types'

export const useAdminStore = defineStore('admin', () => {
  const users = ref<User[]>([])
  const rides = ref<Carona[]>([])
  const isLoading = ref(false)

  const fetchUsers = async () => {
    isLoading.value = true
    try {
      const { data } = await api.get('/admin/users')
      users.value = data
    } catch (error) {
      toast.error('Erro ao carregar usuários.')
    } finally {
      isLoading.value = false
    }
  }

  const fetchRides = async () => {
    isLoading.value = true
    try {
      const { data } = await api.get('/admin/rides')
      rides.value = data
    } catch (error) {
      toast.error('Erro ao carregar caronas.')
    } finally {
      isLoading.value = false
    }
  }

  const toggleUserStatus = async (user: User) => {
    try {
      const { data } = await api.patch(`/admin/users/${user.id}/status`)

      const foundUser = users.value.find(u => u.id === user.id)
      if (foundUser) {
        foundUser.isActive = data.user.isActive
      }

      toast.success(data.message)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao alterar status.'))
    }
  }

  const deleteRide = async (rideId: number) => {
    try {
      await api.delete(`/admin/rides/${rideId}`)

      rides.value = rides.value.filter(r => r.id !== rideId)

      toast.success('Carona excluída com sucesso.')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao excluir carona.'))
    }
  }

  return {
    users,
    rides,
    isLoading,
    fetchUsers,
    fetchRides,
    toggleUserStatus,
    deleteRide
  }
})
