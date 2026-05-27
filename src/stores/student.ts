import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Student, TestBatch, Appointment, TestScore, TestNotice } from '@/types'
import { mockStudents, mockBatches, mockScores, mockNotices, mockAppointments } from '@/utils/mockData'

export const useStudentStore = defineStore('student', () => {
  // State
  const currentUser = ref<Student | null>(null)
  const isLoggedIn = ref(false)
  const batches = ref<TestBatch[]>(mockBatches)
  const appointments = ref<Appointment[]>(mockAppointments)
  const scores = ref<TestScore[]>(mockScores)
  const notices = ref<TestNotice[]>(mockNotices)

  // 从localStorage恢复登录状态
  const savedUser = localStorage.getItem('currentUser')
  if (savedUser) {
    currentUser.value = JSON.parse(savedUser)
    isLoggedIn.value = true
  }

  // Getters
  const userStats = computed(() => ({
    totalAppointments: appointments.value.length,
    confirmedAppointments: appointments.value.filter((a) => a.status === 'confirmed').length,
    completedAppointments: appointments.value.filter((a) => a.status === 'completed').length,
    totalScores: scores.value.length,
    averageScore:
      scores.value.length > 0
        ? (scores.value.reduce((sum, s) => sum + s.totalScore, 0) / scores.value.length).toFixed(2)
        : 0,
  }))

  const availableBatches = computed(() => batches.value.filter((b) => b.status === 'open' && b.remainingSlots > 0))

  // Actions
  const login = async (studentId: string, password: string) => {
    if (!studentId || !password) {
      return { success: false, message: '账号或密码不能为空' }
    }

    const user = mockStudents.find((u) => u.studentId === studentId)
    if (!user) {
      return { success: false, message: '账号或密码错误，请重新输入' }
    }

    currentUser.value = user
    isLoggedIn.value = true
    localStorage.setItem('currentUser', JSON.stringify(user))
    localStorage.setItem('isLoggedIn', 'true')
    return { success: true, message: '登录成功' }
  }

  const logout = () => {
    currentUser.value = null
    isLoggedIn.value = false
    localStorage.removeItem('currentUser')
    localStorage.removeItem('isLoggedIn')
    appointments.value = mockAppointments
  }

  const appointBatch = (batchId: string) => {
    const batch = batches.value.find((b) => b.id === batchId)
    if (!batch || batch.remainingSlots <= 0) {
      return { success: false, message: '该批次已满或已关闭' }
    }

    // 检查是否已预约
    const existing = appointments.value.find((a) => a.batchId === batchId && a.status !== 'cancelled')
    if (existing) {
      return { success: false, message: '您已预约过该时段' }
    }

    // 创建新预约
    const newAppointment: Appointment = {
      id: `appt_${Date.now()}`,
      studentId: currentUser.value?.id || '',
      batchId,
      batchName: batch.name,
      project: batch.project,
      date: batch.date,
      timeSlot: batch.timeSlot,
      location: batch.location,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }

    appointments.value.push(newAppointment)
    batch.remainingSlots--

    return { success: true, message: '预约成功' }
  }

  const cancelAppointment = (appointmentId: string) => {
    const appointment = appointments.value.find((a) => a.id === appointmentId)
    if (!appointment) {
      return { success: false, message: '预约记录不存在' }
    }

    appointment.status = 'cancelled'
    const batch = batches.value.find((b) => b.id === appointment.batchId)
    if (batch) {
      batch.remainingSlots++
    }

    return { success: true, message: '已取消预约' }
  }

  const searchBatches = (keyword: string) => {
    return batches.value.filter(
      (b) =>
        b.name.includes(keyword) ||
        b.project.includes(keyword) ||
        b.location.includes(keyword) ||
        b.teacher.includes(keyword),
    )
  }

  const filterBatches = (filters: {
    date?: string
    location?: string
    project?: string
  }) => {
    return batches.value.filter((b) => {
      if (filters.date && b.date !== filters.date) return false
      if (filters.location && b.location !== filters.location) return false
      if (filters.project && b.project !== filters.project) return false
      return true
    })
  }

  return {
    // State
    currentUser,
    isLoggedIn,
    batches,
    appointments,
    scores,
    notices,

    // Getters
    userStats,
    availableBatches,

    // Actions
    login,
    logout,
    appointBatch,
    cancelAppointment,
    searchBatches,
    filterBatches,
  }
})
