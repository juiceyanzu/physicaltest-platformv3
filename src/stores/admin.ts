import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Admin, Student, Teacher, TestBatch, TestNotice, Banner, TestProject } from '@/types'
import { mockAdmins, mockStudents, mockTeachers, mockBatches, mockNotices, mockBanners, mockProjects } from '@/utils/mockData'

export const useAdminStore = defineStore('admin', () => {
  // State
  const currentAdmin = ref<Admin | null>(null)
  const isLoggedIn = ref(false)
  const admins = ref<Admin[]>(mockAdmins)
  const allStudents = ref<Student[]>(mockStudents.map((s) => ({ ...s, isActive: true })))
  const allTeachers = ref<Teacher[]>(mockTeachers.map((t) => ({ ...t, isActive: true })))
  const batches = ref<TestBatch[]>(mockBatches)
  const notices = ref<TestNotice[]>(mockNotices)
  const banners = ref<Banner[]>(mockBanners)
  const projects = ref<TestProject[]>(mockProjects)

  // 从localStorage恢复登录状态
  const savedAdmin = localStorage.getItem('currentAdmin')
  if (savedAdmin) {
    currentAdmin.value = JSON.parse(savedAdmin)
    isLoggedIn.value = true
  }

  // Getters
  const adminStats = computed(() => ({
    totalUsers: allStudents.value.length + allTeachers.value.length,
    totalStudents: allStudents.value.length,
    totalTeachers: allTeachers.value.length,
    totalBatches: batches.value.length,
    totalNotices: notices.value.length,
    activeBatches: batches.value.filter((b) => b.status === 'open').length,
  }))

  // Actions
  const login = async (username: string, password: string) => {
    if (!username || !password) {
      return { success: false, message: '用户名或密码不能为空' }
    }

    const admin = admins.value.find((a) => a.username === username)
    if (!admin) {
      return { success: false, message: '用户名或密码错误，请重新输入' }
    }

    currentAdmin.value = admin
    isLoggedIn.value = true
    localStorage.setItem('currentAdmin', JSON.stringify(admin))
    return { success: true, message: '登录成功' }
  }

  const logout = () => {
    currentAdmin.value = null
    isLoggedIn.value = false
    localStorage.removeItem('currentAdmin')
  }

  // 用户管理
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      id: `stu_${Date.now()}`,
    }
    allStudents.value.push(newStudent)
    return { success: true, message: '学生添加成功', data: newStudent }
  }

  const updateStudent = (id: string, updates: Partial<Student>) => {
    const index = allStudents.value.findIndex((s) => s.id === id)
    if (index < 0) return { success: false, message: '学生不存在' }
    allStudents.value[index] = { ...allStudents.value[index], ...updates }
    return { success: true, message: '学生信息已更新' }
  }

  const deleteStudent = (id: string) => {
    const index = allStudents.value.findIndex((s) => s.id === id)
    if (index < 0) return { success: false, message: '学生不存在' }
    allStudents.value.splice(index, 1)
    return { success: true, message: '学生已删除' }
  }

  const toggleStudentActive = (id: string) => {
    const student = allStudents.value.find((s) => s.id === id)
    if (!student) return { success: false, message: '学生不存在' }
    // 注意：我们在这里添加isActive属性
    ;(student as any).isActive = !(student as any).isActive
    return { success: true, message: `账号已${(student as any).isActive ? '激活' : '冻结'}` }
  }

  // 项目管理
  const addProject = (project: Omit<TestProject, 'id' | 'createdAt'>) => {
    const newProject: TestProject = {
      ...project,
      id: `project_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    projects.value.push(newProject)
    return { success: true, message: '项目添加成功', data: newProject }
  }

  const updateProject = (id: string, updates: Partial<TestProject>) => {
    const index = projects.value.findIndex((p) => p.id === id)
    if (index < 0) return { success: false, message: '项目不存在' }
    projects.value[index] = { ...projects.value[index], ...updates }
    return { success: true, message: '项目已更新' }
  }

  const deleteProject = (id: string) => {
    const index = projects.value.findIndex((p) => p.id === id)
    if (index < 0) return { success: false, message: '项目不存在' }
    projects.value.splice(index, 1)
    return { success: true, message: '项目已删除' }
  }

  // 批次管理
  const addBatch = (batch: Omit<TestBatch, 'id'>) => {
    const newBatch: TestBatch = {
      ...batch,
      id: `batch_${Date.now()}`,
    }
    batches.value.push(newBatch)
    return { success: true, message: '批次添加成功', data: newBatch }
  }

  const updateBatch = (id: string, updates: Partial<TestBatch>) => {
    const index = batches.value.findIndex((b) => b.id === id)
    if (index < 0) return { success: false, message: '批次不存在' }
    batches.value[index] = { ...batches.value[index], ...updates }
    return { success: true, message: '批次已更新' }
  }

  const deleteBatch = (id: string) => {
    const index = batches.value.findIndex((b) => b.id === id)
    if (index < 0) return { success: false, message: '批次不存在' }
    batches.value.splice(index, 1)
    return { success: true, message: '批次已删除' }
  }

  const toggleBatchStatus = (id: string) => {
    const batch = batches.value.find((b) => b.id === id)
    if (!batch) return { success: false, message: '批次不存在' }
    batch.status = batch.status === 'open' ? 'closed' : 'open'
    return { success: true, message: `预约已${batch.status === 'open' ? '开启' : '关闭'}` }
  }

  // 公告管理
  const addNotice = (notice: Omit<TestNotice, 'id'>) => {
    const newNotice: TestNotice = {
      ...notice,
      id: `notice_${Date.now()}`,
    }
    notices.value.unshift(newNotice)
    return { success: true, message: '公告发布成功', data: newNotice }
  }

  const updateNotice = (id: string, updates: Partial<TestNotice>) => {
    const index = notices.value.findIndex((n) => n.id === id)
    if (index < 0) return { success: false, message: '公告不存在' }
    notices.value[index] = { ...notices.value[index], ...updates }
    return { success: true, message: '公告已更新' }
  }

  const deleteNotice = (id: string) => {
    const index = notices.value.findIndex((n) => n.id === id)
    if (index < 0) return { success: false, message: '公告不存在' }
    notices.value.splice(index, 1)
    return { success: true, message: '公告已删除' }
  }

  // 轮播图管理
  const addBanner = (banner: Omit<Banner, 'id' | 'createdAt'>) => {
    const maxOrder = banners.value.length > 0 ? Math.max(...banners.value.map((b) => b.displayOrder)) : 0
    const newBanner: Banner = {
      ...banner,
      id: `banner_${Date.now()}`,
      createdAt: new Date().toISOString(),
      displayOrder: maxOrder + 1,
    }
    banners.value.push(newBanner)
    return { success: true, message: '轮播图添加成功', data: newBanner }
  }

  const updateBanner = (id: string, updates: Partial<Banner>) => {
    const index = banners.value.findIndex((b) => b.id === id)
    if (index < 0) return { success: false, message: '轮播图不存在' }
    banners.value[index] = { ...banners.value[index], ...updates }
    return { success: true, message: '轮播图已更新' }
  }

  const deleteBanner = (id: string) => {
    const index = banners.value.findIndex((b) => b.id === id)
    if (index < 0) return { success: false, message: '轮播图不存在' }
    banners.value.splice(index, 1)
    return { success: true, message: '轮播图已删除' }
  }

  const reorderBanners = (newOrder: Banner[]) => {
    banners.value = newOrder.map((b, index) => ({ ...b, displayOrder: index + 1 }))
    return { success: true, message: '轮播图顺序已更新' }
  }

  return {
    // State
    currentAdmin,
    isLoggedIn,
    allStudents,
    allTeachers,
    batches,
    notices,
    banners,
    projects,

    // Getters
    adminStats,

    // Actions
    login,
    logout,
    addStudent,
    updateStudent,
    deleteStudent,
    toggleStudentActive,
    addProject,
    updateProject,
    deleteProject,
    addBatch,
    updateBatch,
    deleteBatch,
    toggleBatchStatus,
    addNotice,
    updateNotice,
    deleteNotice,
    addBanner,
    updateBanner,
    deleteBanner,
    reorderBanners,
  }
})
