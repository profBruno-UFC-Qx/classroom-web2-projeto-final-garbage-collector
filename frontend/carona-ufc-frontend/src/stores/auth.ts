import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utils/api'

interface User {
  id: number
  name: string
  email: string
  role: 'passageiro' | 'motorista' | 'admin'
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, pass: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password: pass })

      token.value = data.token
      user.value = data.user

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      return true
    } catch (error: any) {
      console.error('Erro no login:', error.response?.data?.message)
      throw error
    }
  }

  const register = async (name: string, email: string, pass: string) => {
    await api.post('/auth/register', {
      name,
      email,
      password: pass
    })
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout
  }
})
