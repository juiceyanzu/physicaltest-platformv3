const BASE_URL = 'http://localhost:3000/api';

function getToken() {
  return uni.getStorageSync('token') || '';
}

function setToken(token) {
  uni.setStorageSync('token', token);
}

function clearToken() {
  uni.removeStorageSync('token');
}

async function request(url, options = {}) {
  const token = getToken();
  
  const defaultOptions = {
    header: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    method: 'GET',
    ...options
  };

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`,
      ...defaultOptions,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          clearToken();
          const role = uni.getStorageSync('currentTeacher') ? 'teacher' : 'student';
          const loginUrl = role === 'teacher' ? '/pages/teacher/login' : '/pages/student/login';
          uni.reLaunch({ url: loginUrl });
          reject(new Error('未授权'));
        } else {
          reject(new Error(res.data?.message || '请求失败'));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

export const api = {
  auth: {
    login: (data) => request('/users/login', { method: 'POST', data }),
    wechatLogin: (data) => request('/users/wechat-login', { method: 'POST', data }),
    getMe: () => request('/users/me'),
    updateMe: (data) => request('/users/me', { method: 'PUT', data })
  },

  batches: {
    getAll: () => request('/batches'),
    getById: (id) => request(`/batches/${id}`),
    create: (data) => request('/batches', { method: 'POST', data }),
    update: (id, data) => request(`/batches/${id}`, { method: 'PUT', data }),
    delete: (id) => request(`/batches/${id}`, { method: 'DELETE' })
  },

  appointments: {
    getAll: (params) => {
      const keys = Object.keys(params || {});
      const query = keys.map((k) => `${k}=${encodeURIComponent(params[k])}`).join('&');
      return request(`/appointments${query ? '?' + query : ''}`);
    },
    getById: (id) => request(`/appointments/${id}`),
    create: (data) => request('/appointments', { method: 'POST', data }),
    update: (id, data) => request(`/appointments/${id}`, { method: 'PUT', data }),
    delete: (id) => request(`/appointments/${id}`, { method: 'DELETE' })
  },

  scores: {
    getAll: (params) => {
      const keys = Object.keys(params || {});
      const query = keys.map((k) => `${k}=${encodeURIComponent(params[k])}`).join('&');
      return request(`/scores${query ? '?' + query : ''}`);
    },
    getById: (id) => request(`/scores/${id}`),
    create: (data) => request('/scores', { method: 'POST', data }),
    update: (id, data) => request(`/scores/${id}`, { method: 'PUT', data }),
    delete: (id) => request(`/scores/${id}`, { method: 'DELETE' })
  },

  notices: {
    getAll: () => request('/notices'),
    getById: (id) => request(`/notices/${id}`),
    create: (data) => request('/notices', { method: 'POST', data }),
    update: (id, data) => request(`/notices/${id}`, { method: 'PUT', data }),
    delete: (id) => request(`/notices/${id}`, { method: 'DELETE' })
  },

  projects: {
    getAll: () => request('/projects'),
    getById: (id) => request(`/projects/${id}`),
    create: (data) => request('/projects', { method: 'POST', data }),
    update: (id, data) => request(`/projects/${id}`, { method: 'PUT', data }),
    delete: (id) => request(`/projects/${id}`, { method: 'DELETE' })
  },

  users: {
    getStudents: () => request('/users/students'),
    getStudent: (id) => request(`/users/students/${id}`),
    createStudent: (data) => request('/users/students', { method: 'POST', data }),
    updateStudent: (id, data) => request(`/users/students/${id}`, { method: 'PUT', data }),
    deleteStudent: (id) => request(`/users/students/${id}`, { method: 'DELETE' }),
    getTeachers: () => request('/users/teachers'),
    createTeacher: (data) => request('/users/teachers', { method: 'POST', data }),
    updateTeacher: (id, data) => request(`/users/teachers/${id}`, { method: 'PUT', data }),
    deleteTeacher: (id) => request(`/users/teachers/${id}`, { method: 'DELETE' })
  }
};

export { getToken, setToken, clearToken };