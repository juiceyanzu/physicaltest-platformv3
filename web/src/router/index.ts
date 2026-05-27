import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/teacher',
    name: 'Teacher',
    component: () => import('@/views/teacher/Layout.vue'),
    meta: { role: 'teacher' },
    children: [
      { path: '', redirect: 'dashboard' },
      { path: 'dashboard', name: 'TeacherDashboard', component: () => import('@/views/teacher/Dashboard.vue') },
      { path: 'appointments', name: 'TeacherAppointments', component: () => import('@/views/teacher/Appointments.vue') },
      { path: 'scores', name: 'TeacherScores', component: () => import('@/views/teacher/Scores.vue') }
    ]
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/Layout.vue'),
    meta: { role: 'admin' },
    children: [
      { path: '', redirect: 'dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('@/views/admin/Dashboard.vue') },
      { path: 'users', name: 'AdminUsers', component: () => import('@/views/admin/Users.vue') },
      { path: 'batches', name: 'AdminBatches', component: () => import('@/views/admin/Batches.vue') },
      { path: 'projects', name: 'AdminProjects', component: () => import('@/views/admin/Projects.vue') },
      { path: 'notices', name: 'AdminNotices', component: () => import('@/views/admin/Notices.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
    return
  }

  const token = localStorage.getItem('token')
  if (!token) {
    next('/login')
    return
  }

  // Check role-based access
  const requiredRole = to.matched.find(record => record.meta.role)?.meta.role
  if (requiredRole) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.role !== requiredRole) {
        if (payload.role === 'admin') {
          next('/admin/dashboard')
        } else if (payload.role === 'teacher') {
          next('/teacher/dashboard')
        } else {
          next('/login')
        }
        return
      }
    } catch {
      next('/login')
      return
    }
  }

  next()
})

export default router
