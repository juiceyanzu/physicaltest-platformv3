import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useStudentStore } from '@/stores/student'
import { useTeacherStore } from '@/stores/teacher'
import { useAdminStore } from '@/stores/admin'

// 学生端页面
const studentRoutes: RouteRecordRaw[] = [
  {
    path: 'login',
    name: 'StudentLogin',
    component: () => import('@/views/student/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: 'home',
    name: 'StudentHome',
    component: () => import('@/views/student/Home.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: 'notices',
    name: 'StudentNotices',
    component: () => import('@/views/student/Notices.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: 'notices/:id',
    name: 'NoticeDetail',
    component: () => import('@/views/student/NoticeDetail.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: 'appointments',
    name: 'Appointments',
    component: () => import('@/views/student/Appointments.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: 'my-appointments',
    name: 'MyAppointments',
    component: () => import('@/views/student/MyAppointments.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: 'scores',
    name: 'Scores',
    component: () => import('@/views/student/Scores.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: 'profile',
    name: 'Profile',
    component: () => import('@/views/student/Profile.vue'),
    meta: { requiresAuth: true },
  },
]

// 管理端页面
const adminRoutes: RouteRecordRaw[] = [
  {
    path: 'login',
    name: 'AdminLogin',
    component: () => import('@/views/admin/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: 'dashboard',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: 'users',
    name: 'AdminUsers',
    component: () => import('@/views/admin/Users.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: 'projects',
    name: 'AdminProjects',
    component: () => import('@/views/admin/Projects.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: 'batches',
    name: 'AdminBatches',
    component: () => import('@/views/admin/Batches.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: 'notices',
    name: 'AdminNotices',
    component: () => import('@/views/admin/Notices.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: 'banners',
    name: 'AdminBanners',
    component: () => import('@/views/admin/Banners.vue'),
    meta: { requiresAuth: true },
  },
]

// 教师端页面
const teacherRoutes: RouteRecordRaw[] = [
  {
    path: 'login',
    name: 'TeacherLogin',
    component: () => import('@/views/teacher/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: 'dashboard',
    name: 'TeacherDashboard',
    component: () => import('@/views/teacher/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: 'appointments',
    name: 'TeacherAppointments',
    component: () => import('@/views/teacher/Appointments.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: 'score-entry',
    name: 'ScoreEntry',
    component: () => import('@/views/teacher/ScoreEntry.vue'),
    meta: { requiresAuth: true },
  },
]

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/student/login',
  },
  {
    path: '/student',
    name: 'Student',
    component: () => import('@/layouts/StudentLayout.vue'),
    children: studentRoutes,
  },
  {
    path: '/teacher',
    name: 'Teacher',
    component: () => import('@/layouts/TeacherLayout.vue'),
    children: teacherRoutes,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: adminRoutes,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const studentStore = useStudentStore()
  const teacherStore = useTeacherStore()
  const adminStore = useAdminStore()

  if (to.path.startsWith('/student')) {
    if (to.meta.requiresAuth && !studentStore.isLoggedIn) {
      next('/student/login')
    } else if (to.path === '/student/login' && studentStore.isLoggedIn) {
      next('/student/home')
    } else {
      next()
    }
  } else if (to.path.startsWith('/teacher')) {
    if (to.meta.requiresAuth && !teacherStore.isLoggedIn) {
      next('/teacher/login')
    } else if (to.path === '/teacher/login' && teacherStore.isLoggedIn) {
      next('/teacher/dashboard')
    } else {
      next()
    }
  } else if (to.path.startsWith('/admin')) {
    if (to.meta.requiresAuth && !adminStore.isLoggedIn) {
      next('/admin/login')
    } else if (to.path === '/admin/login' && adminStore.isLoggedIn) {
      next('/admin/dashboard')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
