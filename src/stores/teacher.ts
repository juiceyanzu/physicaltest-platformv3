import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Teacher, Appointment, Student, TestBatch, ScoreEntry } from '@/types'
import { mockTeachers, mockAppointments, mockStudents, mockBatches, mockScoreEntries } from '@/utils/mockData'

export const useTeacherStore = defineStore('teacher', () => {
  // State
  const currentTeacher = ref<Teacher | null>(null)
  const isLoggedIn = ref(false)
  const teachers = ref<Teacher[]>(mockTeachers)
  const allAppointments = ref<Appointment[]>(mockAppointments)
  const allStudents = ref<Student[]>(mockStudents)
  const batches = ref<TestBatch[]>(mockBatches)
  const scoreEntries = ref<ScoreEntry[]>(mockScoreEntries)

  // 从localStorage恢复登录状态
  const savedTeacher = localStorage.getItem('currentTeacher')
  if (savedTeacher) {
    currentTeacher.value = JSON.parse(savedTeacher)
    isLoggedIn.value = true
  }

  // Getters
  const assignedBatches = computed(() => {
    if (!currentTeacher.value) return []
    return batches.value.filter((b) => currentTeacher.value?.batchIds.includes(b.id))
  })

  const teacherStats = computed(() => {
    if (!currentTeacher.value) return { totalAppointments: 0, submittedScores: 0, draftScores: 0 }

    const relevantAppointments = allAppointments.value.filter((a) =>
      currentTeacher.value?.batchIds.some((bid) => bid === a.batchId),
    )
    const relevantScores = scoreEntries.value.filter((s) =>
      currentTeacher.value?.batchIds.includes(s.batchId),
    )

    return {
      totalAppointments: relevantAppointments.length,
      submittedScores: relevantScores.filter((s) => s.status === 'submitted').length,
      draftScores: relevantScores.filter((s) => s.status === 'draft').length,
    }
  })

  // Actions
  const login = async (workId: string, password: string) => {
    if (!workId || !password) {
      return { success: false, message: '工号或密码不能为空' }
    }

    const teacher = teachers.value.find((t) => t.workId === workId)
    if (!teacher) {
      return { success: false, message: '工号或密码错误，请重新输入' }
    }

    currentTeacher.value = teacher
    isLoggedIn.value = true
    localStorage.setItem('currentTeacher', JSON.stringify(teacher))
    localStorage.setItem('teacherLoggedIn', 'true')
    return { success: true, message: '登录成功' }
  }

  const logout = () => {
    currentTeacher.value = null
    isLoggedIn.value = false
    localStorage.removeItem('currentTeacher')
    localStorage.removeItem('teacherLoggedIn')
  }

  // 获取教师负责的批次的学生预约
  const getAppointmentsByBatch = (batchId: string) => {
    if (!currentTeacher.value?.batchIds.includes(batchId)) {
      return []
    }
    return allAppointments.value
      .filter((a) => a.batchId === batchId && a.status === 'confirmed')
      .map((a) => {
        const student = allStudents.value.find((s) => s.id === a.studentId)
        return {
          ...a,
          studentPhone: student?.phone || '',
        }
      })
  }

  // 获取教师所有负责批次的学生预约
  const getAllAppointments = () => {
    if (!currentTeacher.value) return []
    return allAppointments.value
      .filter((a) => currentTeacher.value?.batchIds.includes(a.batchId) && a.status === 'confirmed')
      .map((a) => {
        const student = allStudents.value.find((s) => s.id === a.studentId)
        const batch = batches.value.find((b) => b.id === a.batchId)
        return {
          ...a,
          studentPhone: student?.phone || '',
          batchName: batch?.name || '',
        }
      })
  }

  // 获取批次的成绩录入列表
  const getScoreEntriesByBatch = (batchId: string) => {
    if (!currentTeacher.value?.batchIds.includes(batchId)) {
      return []
    }
    return scoreEntries.value.filter((s) => s.batchId === batchId)
  }

  // 获取或创建学生的成绩记录
  const getOrCreateScoreEntry = (batchId: string, studentId: string) => {
    if (!currentTeacher.value?.batchIds.includes(batchId)) {
      return null
    }

    let entry = scoreEntries.value.find((s) => s.batchId === batchId && s.studentId === studentId)

    if (!entry) {
      const student = allStudents.value.find((s) => s.id === studentId)
      if (!student) return null

      entry = {
        id: `score_entry_${Date.now()}`,
        studentId,
        studentName: student.name,
        studentClass: student.class,
        batchId,
        items: [
          { name: '身高体重', score: null, remarks: '' },
          { name: '肺活量', score: null, remarks: '' },
          { name: '50米跑', score: null, remarks: '' },
          { name: '坐位体前屈', score: null, remarks: '' },
          { name: '1000米跑', score: null, remarks: '' },
          { name: '引体向上', score: null, remarks: '' },
        ],
        status: 'draft',
      }
      scoreEntries.value.push(entry)
    }

    return entry
  }

  // 保存成绩（暂存）
  const saveScoreEntry = (entry: ScoreEntry) => {
    if (!currentTeacher.value?.batchIds.includes(entry.batchId)) {
      return { success: false, message: '您没有权限操作该批次' }
    }

    const index = scoreEntries.value.findIndex((s) => s.id === entry.id)
    if (index >= 0) {
      scoreEntries.value[index] = { ...entry, status: 'draft' }
    } else {
      scoreEntries.value.push({ ...entry, status: 'draft' })
    }

    return { success: true, message: '成绩已保存' }
  }

  // 提交成绩
  const submitScoreEntry = (entry: ScoreEntry) => {
    if (!currentTeacher.value?.batchIds.includes(entry.batchId)) {
      return { success: false, message: '您没有权限操作该批次' }
    }

    // 计算总分
    const total = entry.items.reduce((sum, item) => sum + (item.score || 0), 0)

    const submittedEntry: ScoreEntry = {
      ...entry,
      totalScore: total,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    }

    const index = scoreEntries.value.findIndex((s) => s.id === entry.id)
    if (index >= 0) {
      scoreEntries.value[index] = submittedEntry
    } else {
      scoreEntries.value.push(submittedEntry)
    }

    return { success: true, message: '成绩已提交待审核' }
  }

  // 导出到Excel（模拟）
  const exportToExcel = (batchId: string) => {
    if (!currentTeacher.value?.batchIds.includes(batchId)) {
      return { success: false, message: '您没有权限导出该批次' }
    }

    const appointments = getAppointmentsByBatch(batchId)
    const batch = batches.value.find((b) => b.id === batchId)

    if (appointments.length === 0) {
      return { success: false, message: '该批次没有学生预约' }
    }

    // 构建Excel数据
    const data = {
      filename: `${batch?.name || '体测'}_学生名单_${new Date().toLocaleDateString('zh-CN')}.xlsx`,
      rows: [
        ['序号', '学号', '姓名', '班级', '电话', '预约时段', '备注'],
        ...appointments.map((a, index) => [
          index + 1,
          allStudents.value.find((s) => s.id === a.studentId)?.studentId || '',
          allStudents.value.find((s) => s.id === a.studentId)?.name || '',
          allStudents.value.find((s) => s.id === a.studentId)?.class || '',
          a.studentPhone,
          a.timeSlot,
          '',
        ]),
      ],
    }

    return { success: true, message: '文件已准备好下载', data }
  }

  // 获取学生信息
  const getStudent = (studentId: string) => {
    return allStudents.value.find((s) => s.id === studentId)
  }

  return {
    // State
    currentTeacher,
    isLoggedIn,
    teachers,
    allAppointments,
    batches,
    scoreEntries,

    // Getters
    assignedBatches,
    teacherStats,

    // Actions
    login,
    logout,
    getAppointmentsByBatch,
    getAllAppointments,
    getScoreEntriesByBatch,
    getOrCreateScoreEntry,
    saveScoreEntry,
    submitScoreEntry,
    exportToExcel,
    getStudent,
  }
})
