import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { User } from '@/types'
import api from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const storedUser = localStorage.getItem('user')
  const user = ref<User | null>(storedUser ? JSON.parse(storedUser) : null)
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
    try {
      await api.post('/auth/register', {
        name,
        email,
        password: pass
      })
      // Não faço login direto porque meu back não retorna o token no registro
    } catch (error: any) {
      console.error('Erro no cadastro:', error.response?.data?.message)
      throw error
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (!user.value) return

    user.value = { ...user.value, ...userData }

    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    setToken
  }
})
