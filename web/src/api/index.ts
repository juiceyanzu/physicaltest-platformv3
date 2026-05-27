import axios from 'axios'

const BASE_URL = 'http://localhost:3000/api'

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const api = {
  auth: {
    login: (data: { username: string; password: string }) => instance.post('/users/login', data),
    getMe: () => instance.get('/users/me')
  },

  batches: {
    getAll: () => instance.get('/batches'),
    getById: (id: string) => instance.get(`/batches/${id}`),
    create: (data: any) => instance.post('/batches', data),
    update: (id: string, data: any) => instance.put(`/batches/${id}`, data),
    delete: (id: string) => instance.delete(`/batches/${id}`)
  },

  appointments: {
    getAll: (params?: any) => instance.get('/appointments', { params }),
    getById: (id: string) => instance.get(`/appointments/${id}`),
    update: (id: string, data: any) => instance.put(`/appointments/${id}`, data),
    create: (data: any) => instance.post('/appointments', data),
    delete: (id: string) => instance.delete(`/appointments/${id}`)
  },

  scores: {
    getAll: (params?: any) => instance.get('/scores', { params }),
    create: (data: any) => instance.post('/scores', data),
    update: (id: string, data: any) => instance.put(`/scores/${id}`, data),
    delete: (id: string) => instance.delete(`/scores/${id}`)
  },

  notices: {
    getAll: () => instance.get('/notices'),
    getAllForAdmin: () => instance.get('/notices/all'),
    create: (data: any) => instance.post('/notices', data),
    update: (id: string, data: any) => instance.put(`/notices/${id}`, data),
    delete: (id: string) => instance.delete(`/notices/${id}`)
  },

  projects: {
    getAll: () => instance.get('/projects'),
    create: (data: any) => instance.post('/projects', data),
    update: (id: string, data: any) => instance.put(`/projects/${id}`, data),
    delete: (id: string) => instance.delete(`/projects/${id}`)
  },

  users: {
    getStudents: () => instance.get('/users/students'),
    getStudent: (id: string) => instance.get(`/users/students/${id}`),
    createStudent: (data: any) => instance.post('/users/students', data),
    updateStudent: (id: string, data: any) => instance.put(`/users/students/${id}`, data),
    deleteStudent: (id: string) => instance.delete(`/users/students/${id}`),
    getTeachers: () => instance.get('/users/teachers'),
    createTeacher: (data: any) => instance.post('/users/teachers', data),
    updateTeacher: (id: string, data: any) => instance.put(`/users/teachers/${id}`, data),
    deleteTeacher: (id: string) => instance.delete(`/users/teachers/${id}`),
    getAdmins: () => instance.get('/users/admins'),
    toggleStatus: (id: string) => instance.put(`/users/${id}/status`)
  }
}
