import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api, setToken, clearToken } from '@/api'

export const useTeacherStore = defineStore('teacher', () => {
  const currentUser = ref<any>(null)
  const isLoggedIn = ref(false)
  const batches = ref<any[]>([])
  const appointments = ref<any[]>([])
  const scores = ref<any[]>([])
  const students = ref<any[]>([])
  const projects = ref<any[]>([])

  const savedUser = uni.getStorageSync('currentTeacher')
  if (savedUser) {
    currentUser.value = savedUser
    isLoggedIn.value = true
  }

  const userStats = computed(() => ({
    totalBatches: batches.value.length,
    totalAppointments: appointments.value.length,
    completedAppointments: appointments.value.filter((a) => a.status === 'completed').length,
    pendingAppointments: appointments.value.filter((a) => a.status === 'pending').length,
    totalScores: scores.value.length,
  }))

  const login = async (workId: string, password: string) => {
    if (!workId || !password) {
      return { success: false, message: '工号或密码不能为空' }
    }

    try {
      const response = await api.auth.login({ username: workId, password })
      if (response.success) {
        currentUser.value = response.data.user
        isLoggedIn.value = true
        setToken(response.data.token)
        uni.setStorageSync('currentTeacher', response.data.user)
        return { success: true, message: '登录成功' }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error: any) {
      console.error('Teacher login error:', error)
      return { success: false, message: error?.message || '登录失败，请检查网络连接' }
    }
  }

  const logout = () => {
    currentUser.value = null
    isLoggedIn.value = false
    uni.removeStorageSync('currentTeacher')
    clearToken()
  }

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

  const loadAppointments = async () => {
    try {
      const response = await api.appointments.getAll({})
      if (response.success) {
        appointments.value = response.data.map((a: any) => ({
          ...a,
          studentName: a.student_name || a.student_id,
          batchName: a.batch_name || a.batch_id,
          createdAt: a.created_at
        }))
      }
    } catch (error) {
      console.error('Load appointments error:', error)
      appointments.value = []
    }
  }

  const loadScores = async () => {
    try {
      const response = await api.scores.getAll({})
      if (response.success) {
        scores.value = response.data.map((s: any) => ({
          ...s,
          studentName: s.student_name || s.student_id,
          projectName: s.project_name || s.project_id,
        }))
      }
    } catch (error) {
      console.error('Load scores error:', error)
      scores.value = []
    }
  }

  const loadStudents = async () => {
    try {
      const response = await api.users.getStudents()
      if (response.success) {
        students.value = response.data
      }
    } catch (error) {
      console.error('Load students error:', error)
      students.value = []
    }
  }

  const loadProjects = async () => {
    try {
      const response = await api.projects.getAll()
      if (response.success) {
        projects.value = response.data
      }
    } catch (error) {
      console.error('Load projects error:', error)
      projects.value = []
    }
  }

  const markAppointmentComplete = async (appointmentId: string) => {
    try {
      const response = await api.appointments.update(appointmentId, { status: 'completed' })
      if (response.success) {
        await loadAppointments()
        await loadBatches()
        return { success: true, message: '标记完成成功' }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Mark complete error:', error)
      return { success: false, message: error?.message || '操作失败' }
    }
  }

  const enterScore = async (data: any) => {
    try {
      const { studentId, batchId, items } = data
      const results = await Promise.all(
        items.map((item: any) =>
          api.scores.create({
            studentId,
            batchId,
            projectId: item.projectId || item.name,
            score: item.score,
            remarks: item.remarks || ''
          })
        )
      )
      const allSuccess = results.every((r: any) => r.success)
      if (allSuccess) {
        await loadScores()
        return { success: true, message: '成绩录入成功' }
      }
      return { success: false, message: '部分成绩录入失败' }
    } catch (error: any) {
      console.error('Enter score error:', error)
      return { success: false, message: error?.message || '录入失败' }
    }
  }

  const updateScore = async (id: string, data: { score: number; remarks: string }) => {
    try {
      const response = await api.scores.update(id, data)
      if (response.success) {
        await loadScores()
        return { success: true, message: '成绩更新成功' }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Update score error:', error)
      return { success: false, message: error?.message || '更新失败' }
    }
  }

  const deleteScore = async (id: string) => {
    try {
      const response = await api.scores.delete(id)
      if (response.success) {
        await loadScores()
        return { success: true, message: '删除成功' }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Delete score error:', error)
      return { success: false, message: error?.message || '删除失败' }
    }
  }

  const getAppointmentsByBatch = (batchId: string) => {
    return appointments.value.filter((a) => a.batch_id === batchId || a.batchId === batchId)
  }

  return {
    currentUser,
    isLoggedIn,
    batches,
    appointments,
    scores,
    students,
    projects,
    userStats,
    login,
    logout,
    loadBatches,
    loadAppointments,
    loadScores,
    loadStudents,
    loadProjects,
    markAppointmentComplete,
    enterScore,
    updateScore,
    deleteScore,
    getAppointmentsByBatch,
  }
})
