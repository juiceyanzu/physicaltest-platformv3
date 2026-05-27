import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api, setToken, clearToken } from '@/api'

export const useAdminStore = defineStore('admin', () => {
  const currentUser = ref<any>(null)
  const isLoggedIn = ref(false)
  const students = ref<any[]>([])
  const teachers = ref<any[]>([])
  const admins = ref<any[]>([])
  const batches = ref<any[]>([])
  const projects = ref<any[]>([])
  const notices = ref<any[]>([])

  const savedUser = uni.getStorageSync('currentAdmin')
  if (savedUser) {
    currentUser.value = savedUser
    isLoggedIn.value = true
  }

  const login = async (username: string, password: string) => {
    if (!username || !password) {
      return { success: false, message: '用户名或密码不能为空' }
    }

    try {
      const response = await api.auth.login({ username, password })
      if (response.success) {
        currentUser.value = response.data.user
        isLoggedIn.value = true
        setToken(response.data.token)
        uni.setStorageSync('currentAdmin', response.data.user)
        return { success: true, message: '登录成功' }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error: any) {
      console.error('Admin login error:', error)
      return { success: false, message: error?.message || '登录失败，请检查网络连接' }
    }
  }

  const logout = () => {
    currentUser.value = null
    isLoggedIn.value = false
    uni.removeStorageSync('currentAdmin')
    clearToken()
  }

  // Students
  const loadStudents = async () => {
    try {
      const response = await api.users.getStudents()
      if (response.success) students.value = response.data
    } catch (error) {
      console.error('Load students error:', error)
      students.value = []
    }
  }

  const addStudent = async (data: any) => {
    try {
      const response = await api.users.createStudent(data)
      if (response.success) { await loadStudents(); return { success: true, message: response.message } }
      return { success: false, message: response.message }
    } catch (error: any) {
      return { success: false, message: error?.message || '添加失败' }
    }
  }

  const updateStudent = async (id: string, data: any) => {
    try {
      const response = await api.users.updateStudent(id, data)
      if (response.success) { await loadStudents(); return { success: true, message: response.message } }
      return { success: false, message: response.message }
    } catch (error: any) {
      return { success: false, message: error?.message || '更新失败' }
    }
  }

  const deleteStudent = async (id: string) => {
    try {
      const response = await api.users.deleteStudent(id)
      if (response.success) { await loadStudents(); return { success: true, message: response.message } }
      return { success: false, message: response.message }
    } catch (error: any) {
      return { success: false, message: error?.message || '删除失败' }
    }
  }

  // Teachers
  const loadTeachers = async () => {
    try {
      const response = await api.users.getTeachers()
      if (response.success) teachers.value = response.data
    } catch (error) {
      console.error('Load teachers error:', error)
      teachers.value = []
    }
  }

  // Batches
  const loadBatches = async () => {
    try {
      const response = await api.batches.getAll()
      if (response.success) {
        batches.value = response.data.map((b: any) => ({
          ...b,
          startDate: b.start_date,
          endDate: b.end_date,
          maxCapacity: b.max_capacity,
          currentCount: b.current_count
        }))
      }
    } catch (error) {
      console.error('Load batches error:', error)
      batches.value = []
    }
  }

  const addBatch = async (data: any) => {
    try {
      const response = await api.batches.create(data)
      if (response.success) { await loadBatches(); return { success: true, message: response.message } }
      return { success: false, message: response.message }
    } catch (error: any) {
      return { success: false, message: error?.message || '添加失败' }
    }
  }

  const updateBatch = async (id: string, data: any) => {
    try {
      const response = await api.batches.update(id, data)
      if (response.success) { await loadBatches(); return { success: true, message: response.message } }
      return { success: false, message: response.message }
    } catch (error: any) {
      return { success: false, message: error?.message || '更新失败' }
    }
  }

  const deleteBatch = async (id: string) => {
    try {
      const response = await api.batches.delete(id)
      if (response.success) { await loadBatches(); return { success: true, message: response.message } }
      return { success: false, message: response.message }
    } catch (error: any) {
      return { success: false, message: error?.message || '删除失败' }
    }
  }

  // Projects
  const loadProjects = async () => {
    try {
      const response = await api.projects.getAll()
      if (response.success) {
        projects.value = response.data.map((p: any) => ({
          ...p,
          genderRequirement: p.gender_requirement,
          minScore: p.min_score,
          maxScore: p.max_score,
          isRequired: p.is_required === 1
        }))
      }
    } catch (error) {
      console.error('Load projects error:', error)
      projects.value = []
    }
  }

  const addProject = async (data: any) => {
    try {
      const response = await api.projects.create(data)
      if (response.success) { await loadProjects(); return { success: true, message: response.message } }
      return { success: false, message: response.message }
    } catch (error: any) {
      return { success: false, message: error?.message || '添加失败' }
    }
  }

  const updateProject = async (id: string, data: any) => {
    try {
      const response = await api.projects.update(id, data)
      if (response.success) { await loadProjects(); return { success: true, message: response.message } }
      return { success: false, message: response.message }
    } catch (error: any) {
      return { success: false, message: error?.message || '更新失败' }
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const response = await api.projects.delete(id)
      if (response.success) { await loadProjects(); return { success: true, message: response.message } }
      return { success: false, message: response.message }
    } catch (error: any) {
      return { success: false, message: error?.message || '删除失败' }
    }
  }

  // Notices
  const loadNotices = async () => {
    try {
      const response = await api.notices.getAll()
      if (response.success) {
        notices.value = response.data.map((n: any) => ({ ...n, createdAt: n.created_at }))
      }
    } catch (error) {
      console.error('Load notices error:', error)
      notices.value = []
    }
  }

  const addNotice = async (data: any) => {
    try {
      const response = await api.notices.create(data)
      if (response.success) { await loadNotices(); return { success: true, message: response.message } }
      return { success: false, message: response.message }
    } catch (error: any) {
      return { success: false, message: error?.message || '添加失败' }
    }
  }

  const updateNotice = async (id: string, data: any) => {
    try {
      const response = await api.notices.update(id, data)
      if (response.success) { await loadNotices(); return { success: true, message: response.message } }
      return { success: false, message: response.message }
    } catch (error: any) {
      return { success: false, message: error?.message || '更新失败' }
    }
  }

  const deleteNotice = async (id: string) => {
    try {
      const response = await api.notices.delete(id)
      if (response.success) { await loadNotices(); return { success: true, message: response.message } }
      return { success: false, message: response.message }
    } catch (error: any) {
      return { success: false, message: error?.message || '删除失败' }
    }
  }

  return {
    currentUser,
    isLoggedIn,
    students,
    teachers,
    admins,
    batches,
    projects,
    notices,
    login,
    logout,
    loadStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    loadTeachers,
    loadBatches,
    addBatch,
    updateBatch,
    deleteBatch,
    loadProjects,
    addProject,
    updateProject,
    deleteProject,
    loadNotices,
    addNotice,
    updateNotice,
    deleteNotice,
  }
})
