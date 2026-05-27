import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'

export interface User {
  id: string
  username: string
  role: 'student' | 'teacher' | 'admin'
  nickname: string
}

export interface Profile {
  id: string
  name: string
  gender?: string
  class?: string
  major?: string
  title?: string
  department?: string
  phone?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const profile = ref<Profile | null>(null)
  const isLoggedIn = ref(false)

  async function login(username: string, password: string) {
    try {
      const response = await api.auth.login({ username, password })

      if (response.success) {
        user.value = response.data.user
        profile.value = response.data.profile
        isLoggedIn.value = true
        localStorage.setItem('token', response.data.token)
        return { success: true, message: '登录成功' }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      const message = error.response?.data?.message || '登录失败，请检查网络连接'
      return { success: false, message }
    }
  }

  async function getProfile() {
    try {
      const response = await api.auth.getMe()
      if (response.success) {
        user.value = response.data.user
        profile.value = response.data.profile
      }
    } catch (error) {
      console.error('Get profile error:', error)
    }
  }

  function logout() {
    user.value = null
    profile.value = null
    isLoggedIn.value = false
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return {
    user,
    profile,
    isLoggedIn,
    login,
    getProfile,
    logout
  }
})
