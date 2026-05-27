export interface Student {
  id: string
  studentId: string
  name: string
  class: string
  phone: string
  gender: 'male' | 'female'
  age: number
  avatar?: string
}

export interface Teacher {
  id: string
  workId: string
  name: string
  department: string
  phone: string
  gender: 'male' | 'female'
  avatar?: string
}

export interface Admin {
  id: string
  username: string
  name: string
  phone: string
  role: 'super_admin' | 'operator'
  avatar?: string
}

export interface User {
  id: string
  studentId?: string
  workId?: string
  name: string
  class?: string
  department?: string
  phone: string
  gender: 'male' | 'female'
  age?: number
  type: 'student' | 'teacher'
  avatar?: string
}

export interface TestProject {
  id: string
  name: string
  description: string
  unit: string
  fullMark: number
}

export interface TestBatch {
  id: string
  name: string
  project: string
  date: string
  timeSlot: string
  location: string
  teacher: string
  capacity: number
  remainingSlots: number
  status: 'open' | 'closed' | 'completed'
  requirements: string
}

export interface Appointment {
  id: string
  studentId: string
  studentName?: string
  batchId: string
  batchName: string
  project: string
  date: string
  timeSlot: string
  location: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
  studentPhone?: string
}

export interface TestScore {
  id: string
  studentId: string
  studentName?: string
  batchId: string
  batchName: string
  items: ScoreItem[]
  totalScore: number
  level: string
  testDate: string
}

export interface ScoreItem {
  name: string
  score: number | null
  remarks: string
}

export interface ScoreEntry {
  id: string
  studentId: string
  studentName: string
  studentClass: string
  batchId: string
  items: ScoreItem[]
  totalScore?: number
  status: 'draft' | 'submitted'
  submittedAt?: string
}

export interface TestNotice {
  id: string
  title: string
  content: string
  priority: 'high' | 'normal' | 'low'
  publishDate: string
  author: string
  attachments?: string[]
}

export interface Banner {
  id: string
  title: string
  image: string
  link: string
  priority: number
  status: 'active' | 'inactive'
}

export interface WechatUserInfo {
  openid: string
  nickname: string
  sex: number
  language: string
  city: string
  province: string
  country: string
  headimgurl: string
}

export type WechatLoginState = 'waiting' | 'scanned' | 'success' | 'failed' | 'timeout'