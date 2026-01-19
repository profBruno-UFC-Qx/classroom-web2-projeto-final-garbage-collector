import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'
import { toast } from 'vue3-toastify'
import { type Veiculo } from '@/types'

export const useVehicleStore = defineStore('vehicle', () => {
  const vehicles = ref<Veiculo[]>([])
  const isLoading = ref(false)

  const fetchVehicles = async () => {
    isLoading.value = true
    try {
      const { data } = await api.get('/vehicles')
      vehicles.value = data
    } catch (error) {
      console.error('Erro ao buscar veículos', error)
      toast.error('Erro ao carregar seus veículos.')
    } finally {
      isLoading.value = false
    }
  }

  const addVehicle = async (vehicleData: { brand: string, model: string, color: string, plate: string }) => {
    try {
      const { data } = await api.post('/vehicles', vehicleData)

      vehicles.value.unshift(data)

      return true
    } catch (error: any) {
      const data = error.response?.data

      let message = 'Erro ao cadastrar veículo.'

      if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        message = data.errors[0]
      } else if (data?.message) {
        message = data.message
      }

      toast.error(message)
      throw error
    }
  }

  const updateVehicle = async (id: number, vehicleData: Partial<Veiculo>) => {
    try {
      const { data } = await api.patch(`/vehicles/${id}`, vehicleData)

      const index = vehicles.value.findIndex(v => v.id === id)
      if (index !== -1) {
        vehicles.value[index] = data
      }

      return true
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao atualizar veículo.'
      toast.error(message)
      throw error
    }
  }

  const removeVehicle = async (id: number) => {
    try {
      await api.delete(`/vehicles/${id}`)

      vehicles.value = vehicles.value.filter(v => v.id !== id)

      toast.success('Veículo removido com sucesso.')
    } catch (error) {
      toast.error('Erro ao excluir veículo.')
    }
  }

  return {
    vehicles,
    isLoading,
    fetchVehicles,
    addVehicle,
    removeVehicle,
    updateVehicle
  }
})
