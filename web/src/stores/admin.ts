import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'

export interface Student {
  id: string
  name: string
  gender: string
  class: string
  major: string
  grade: string
  phone: string
  status?: string
  user_id?: string
}

export interface Batch {
  id: string
  name: string
  startDate: string
  endDate: string
  status: string
  maxCapacity: number
  currentCount: number
}

export interface Project {
  id: string
  name: string
  unit: string
  genderRequirement: string
  minScore: number
  maxScore: number
  isRequired: boolean
}

export interface Notice {
  id: string
  title: string
  content: string
  priority: string
  status: string
  createdAt: string
}

export const useAdminStore = defineStore('admin', () => {
  const students = ref<Student[]>([])
  const batches = ref<Batch[]>([])
  const projects = ref<Project[]>([])
  const notices = ref<Notice[]>([])
  const teachers = ref<any[]>([])
  const admins = ref<any[]>([])

  async function loadStudents() {
    try {
      const response = await api.users.getStudents()
      if (response.success) {
        students.value = response.data.map((s: any) => ({ ...s, class: s.class || '' }))
      }
    } catch (error) {
      console.error('Failed to load students:', error)
      students.value = []
    }
  }

  async function createStudent(data: any) {
    try {
      const response = await api.users.createStudent(data)
      if (response.success) {
        await loadStudents()
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Failed to create student:', error)
      return { success: false, message: error.response?.data?.message || '创建失败，请检查网络连接' }
    }
  }

  async function updateStudent(id: string, data: any) {
    try {
      const response = await api.users.updateStudent(id, data)
      if (response.success) {
        await loadStudents()
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Failed to update student:', error)
      return { success: false, message: error.response?.data?.message || '更新失败，请检查网络连接' }
    }
  }

  async function deleteStudent(id: string) {
    try {
      const response = await api.users.deleteStudent(id)
      if (response.success) {
        await loadStudents()
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Failed to delete student:', error)
      return { success: false, message: error.response?.data?.message || '删除失败，请检查网络连接' }
    }
  }

  async function loadTeachers() {
    try {
      const response = await api.users.getTeachers()
      if (response.success) {
        teachers.value = response.data
      }
    } catch (error) {
      console.error('Failed to load teachers:', error)
      teachers.value = []
    }
  }

  async function createTeacher(data: any) {
    try {
      const response = await api.users.createTeacher(data)
      if (response.success) {
        await loadTeachers()
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Failed to create teacher:', error)
      return { success: false, message: error.response?.data?.message || '创建失败，请检查网络连接' }
    }
  }

  async function updateTeacher(id: string, data: any) {
    try {
      const response = await api.users.updateTeacher(id, data)
      if (response.success) {
        await loadTeachers()
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Failed to update teacher:', error)
      return { success: false, message: error.response?.data?.message || '更新失败，请检查网络连接' }
    }
  }

  async function deleteTeacher(id: string) {
    try {
      const response = await api.users.deleteTeacher(id)
      if (response.success) {
        await loadTeachers()
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Failed to delete teacher:', error)
      return { success: false, message: error.response?.data?.message || '删除失败，请检查网络连接' }
    }
  }

  async function loadAdmins() {
    try {
      const response = await api.users.getAdmins()
      if (response.success) {
        admins.value = response.data
      }
    } catch (error) {
      console.error('Failed to load admins:', error)
      admins.value = []
    }
  }

  async function toggleUserStatus(userId: string, role: string) {
    try {
      const response = await api.users.toggleStatus(userId)
      if (response.success) {
        if (role === 'student') await loadStudents()
        else if (role === 'teacher') await loadTeachers()
        else await loadAdmins()
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Failed to toggle user status:', error)
      return { success: false, message: error.response?.data?.message || '操作失败' }
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
      console.error('Failed to load batches:', error)
      batches.value = []
    }
  }

  async function createBatch(data: any) {
    try {
      const response = await api.batches.create(data)
      if (response.success) {
        await loadBatches()
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Failed to create batch:', error)
      return { success: false, message: error.response?.data?.message || '创建失败，请检查网络连接' }
    }
  }

  async function updateBatch(id: string, data: any) {
    try {
      const response = await api.batches.update(id, data)
      if (response.success) {
        await loadBatches()
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Failed to update batch:', error)
      return { success: false, message: error.response?.data?.message || '更新失败，请检查网络连接' }
    }
  }

  async function deleteBatch(id: string) {
    try {
      const response = await api.batches.delete(id)
      if (response.success) {
        await loadBatches()
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Failed to delete batch:', error)
      return { success: false, message: error.response?.data?.message || '删除失败，请检查网络连接' }
    }
  }

  async function loadProjects() {
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
      console.error('Failed to load projects:', error)
      projects.value = []
    }
  }

  async function createProject(data: any) {
    try {
      const response = await api.projects.create(data)
      if (response.success) {
        await loadProjects()
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Failed to create project:', error)
      return { success: false, message: error.response?.data?.message || '创建失败，请检查网络连接' }
    }
  }

  async function updateProject(id: string, data: any) {
    try {
      const response = await api.projects.update(id, data)
      if (response.success) {
        await loadProjects()
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Failed to update project:', error)
      return { success: false, message: error.response?.data?.message || '更新失败，请检查网络连接' }
    }
  }

  async function deleteProject(id: string) {
    try {
      const response = await api.projects.delete(id)
      if (response.success) {
        await loadProjects()
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Failed to delete project:', error)
      return { success: false, message: error.response?.data?.message || '删除失败，请检查网络连接' }
    }
  }

  async function loadNotices() {
    try {
      const response = await api.notices.getAllForAdmin()
      if (response.success) {
        notices.value = response.data.map((n: any) => ({ ...n, createdAt: n.createdAt || n.created_at }))
      }
    } catch (error) {
      console.error('Failed to load notices:', error)
      notices.value = []
    }
  }

  async function createNotice(data: any) {
    try {
      const response = await api.notices.create(data)
      if (response.success) {
        await loadNotices()
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Failed to create notice:', error)
      return { success: false, message: error.response?.data?.message || '创建失败，请检查网络连接' }
    }
  }

  async function updateNotice(id: string, data: any) {
    try {
      const response = await api.notices.update(id, data)
      if (response.success) {
        await loadNotices()
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Failed to update notice:', error)
      return { success: false, message: error.response?.data?.message || '更新失败，请检查网络连接' }
    }
  }

  async function deleteNotice(id: string) {
    try {
      const response = await api.notices.delete(id)
      if (response.success) {
        await loadNotices()
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message }
    } catch (error: any) {
      console.error('Failed to delete notice:', error)
      return { success: false, message: error.response?.data?.message || '删除失败，请检查网络连接' }
    }
  }

  return {
    students, batches, projects, notices, teachers, admins,
    loadStudents, createStudent, updateStudent, deleteStudent,
    loadTeachers, createTeacher, updateTeacher, deleteTeacher,
    loadAdmins,
    toggleUserStatus,
    loadBatches, createBatch, updateBatch, deleteBatch,
    loadProjects, createProject, updateProject, deleteProject,
    loadNotices, createNotice, updateNotice, deleteNotice
  }
})
