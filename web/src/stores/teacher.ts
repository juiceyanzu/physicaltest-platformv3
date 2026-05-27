import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'

export const useTeacherStore = defineStore('teacher', () => {
  const scores = ref<any[]>([])
  const students = ref<any[]>([])
  const projects = ref<any[]>([])
  const batches = ref<any[]>([])
  const appointments = ref<any[]>([])

  async function loadStudents() {
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

  async function loadProjects() {
    try {
      const response = await api.projects.getAll()
      if (response.success) {
        projects.value = response.data.map((p: any) => ({
          ...p,
          genderRequirement: p.genderRequirement || p.gender_requirement,
          minScore: p.minScore || p.min_score,
          maxScore: p.maxScore || p.max_score,
          isRequired: p.isRequired !== undefined ? p.isRequired : p.is_required === 1
        }))
      }
    } catch (error) {
      console.error('Load projects error:', error)
      projects.value = []
    }
  }

  async function loadBatches() {
    try {
      const response = await api.batches.getAll()
      if (response.success) {
        batches.value = response.data.map((b: any) => ({
          ...b,
          startDate: b.startDate || b.start_date,
          endDate: b.endDate || b.end_date,
          maxCapacity: b.maxCapacity || b.max_capacity,
          currentCount: b.currentCount || b.current_count
        }))
      }
    } catch (error) {
      console.error('Load batches error:', error)
      batches.value = []
    }
  }

  async function loadScores() {
    try {
      const response = await api.scores.getAll()
      if (response.success) {
        scores.value = response.data.map((s: any) => ({
          id: s.id,
          studentId: s.studentId || s.student_id,
          projectId: s.projectId || s.project_id,
          batchId: s.batchId || s.batch_id,
          studentName: s.studentName || s.student_name || s.student_id,
          projectName: s.projectName || s.project_name || s.project_id,
          score: s.score,
          remarks: s.remarks,
          enteredAt: s.enteredAt ? new Date(s.enteredAt).toLocaleString() : (s.entered_at ? new Date(s.entered_at).toLocaleString() : '')
        }))
      }
    } catch (error) {
      console.error('Load scores error:', error)
      scores.value = []
    }
  }

  async function createScore(data: { studentId: string, projectId: string, batchId: string, score: number, remarks: string }) {
    try {
      const response = await api.scores.create(data)
      if (response.success) {
        await loadScores()
      }
      return response
    } catch (error) {
      console.error('Create score error:', error)
      return { success: false, message: '创建失败，请检查网络连接' }
    }
  }

  async function updateScore(id: string, data: { score: number, remarks: string }) {
    try {
      const response = await api.scores.update(id, data)
      if (response.success) {
        await loadScores()
      }
      return response
    } catch (error) {
      console.error('Update score error:', error)
      return { success: false, message: '更新失败，请检查网络连接' }
    }
  }

  async function deleteScore(id: string) {
    try {
      const response = await api.scores.delete(id)
      if (response.success) {
        await loadScores()
      }
      return response
    } catch (error) {
      console.error('Delete score error:', error)
      return { success: false, message: '删除失败，请检查网络连接' }
    }
  }

  async function loadAppointments() {
    try {
      const response = await api.appointments.getAll()
      if (response.success) {
        appointments.value = response.data.map((a: any) => ({
          ...a,
          studentName: a.studentName || a.student_name || a.student_id,
          batchName: a.batchName || a.batch_name || a.batch_id,
          student_id: a.studentId || a.student_id,
          batch_id: a.batchId || a.batch_id,
          created_at: a.createdAt || a.created_at,
        }))
      }
    } catch (error) {
      console.error('Load appointments error:', error)
      appointments.value = []
    }
  }

  async function updateAppointment(id: string, data: any) {
    try {
      const response = await api.appointments.update(id, data)
      if (response.success) {
        await loadAppointments()
      }
      return response
    } catch (error) {
      console.error('Update appointment error:', error)
      return { success: false, message: '更新失败，请检查网络连接' }
    }
  }

  return {
    scores,
    students,
    projects,
    batches,
    appointments,
    loadStudents,
    loadProjects,
    loadBatches,
    loadScores,
    createScore,
    updateScore,
    deleteScore,
    loadAppointments,
    updateAppointment
  }
})
