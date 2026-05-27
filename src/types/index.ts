// 学生用户
export interface Student {
  id: string
  name: string
  studentId: string
  class: string
  phone: string
  major: string
  avatar?: string
}

// 体测批次
export interface TestBatch {
  id: string
  name: string
  project: string
  location: string
  date: string
  timeSlot: string
  totalSlots: number
  remainingSlots: number
  teacher: string
  status: 'open' | 'closed' | 'cancelled'
}

// 预约记录
export interface Appointment {
  id: string
  studentId: string
  batchId: string
  batchName: string
  project: string
  date: string
  timeSlot: string
  location: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

// 体测成绩
export interface TestScore {
  id: string
  studentId: string
  testDate: string
  items: {
    name: string
    score: number
    maxScore: number
    grade: string // A/B/C/D
  }[]
  totalScore: number
  maxTotalScore: number
  status: 'pass' | 'fail'
  remarks?: string
}

// 体测公告
export interface TestNotice {
  id: string
  title: string
  content: string
  type: 'schedule' | 'makeup' | 'result' | 'notice'
  publishDate: string
  priority: 'high' | 'normal' | 'low'
  tags: string[]
}

// 教师用户
export interface Teacher {
  id: string
  name: string
  workId: string
  phone: string
  email?: string
  batchIds: string[]  // 负责的批次ID
}

// 成绩录入记录
export interface ScoreEntry {
  id: string
  studentId: string
  studentName: string
  studentClass: string
  batchId: string
  items: {
    name: string
    score: number | null
    remarks?: string
  }[]
  totalScore?: number
  status: 'draft' | 'submitted' | 'rejected'
  submittedAt?: string
  rejectionReason?: string
}

// 管理员用户
export interface Admin {
  id: string
  name: string
  username: string
  role: 'super_admin' | 'admin'
  email?: string
  lastLogin?: string
}

// 轮播图
export interface Banner {
  id: string
  title: string
  imageUrl: string
  linkUrl?: string
  displayOrder: number
  isActive: boolean
  createdAt: string
}

// 体测项目
export interface TestProject {
  id: string
  name: string
  description?: string
  scoringStandard: {
    A: [number, number]  // [最小分, 最大分]
    B: [number, number]
    C: [number, number]
    D: [number, number]
  }
  passingScore: number
  isActive: boolean
  createdAt: string
}
