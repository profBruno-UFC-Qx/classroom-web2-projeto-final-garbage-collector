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

  const cancelRide = async (rideId: number) => {
    try {
      await api.patch(`/admin/rides/${rideId}/cancel`)

      const foundRide = rides.value.find(r => r.id === rideId)
      if (foundRide) {
        foundRide.status = 'cancelled'
      }

      toast.success('Carona cancelada com sucesso.')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao cancelar carona.'))
    }
  }

  return {
    users,
    rides,
    isLoading,
    fetchUsers,
    fetchRides,
    toggleUserStatus,
    cancelRide
  }
})
