import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'

export const useRideStore = defineStore('ride', () => {
  const router = useRouter()
  const isLoading = ref(false)

  const createRide = async (payload: any) => {
    isLoading.value = true
    try {
      await api.post('/rides', payload)

      toast.success('Carona criada com sucesso!')

      router.push('/minhas-caronas')

    } catch (error: any) {
      console.error(error)
      const msg = error.response?.data?.message || 'Erro ao criar carona.'

      if (error.response?.data?.errors?.[0]) {
        toast.error(error.response.data.errors[0])
      } else {
        toast.error(msg)
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    createRide,
    isLoading
  }
})
