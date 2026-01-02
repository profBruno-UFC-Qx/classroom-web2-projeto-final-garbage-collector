import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'
import type { CreateRidePayload } from '@/types'


export const useRideStore = defineStore('ride', () => {
  const isLoading = ref(false)

  const createRide = async (payload: CreateRidePayload) => {
    isLoading.value = true
    try {
      const { data } = await api.post('/rides', payload)
      return data
    }
    catch (error) {
      throw error
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    createRide,
    isLoading
  }
})
