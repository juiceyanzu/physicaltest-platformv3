import { reactive, computed } from 'vue';
import { api, setToken, clearToken } from '@/api';

interface Student {
  id: string;
  name: string;
  gender: string;
  class: string;
  major: string;
  grade: string;
  phone: string;
}

interface User {
  id: string;
  username: string;
  role: string;
  nickname: string;
  avatar?: string;
  name?: string;
  studentId?: string;
  class?: string;
  type?: string;
}

interface Batch {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  maxCapacity: number;
  currentCount: number;
  date: string;
  timeSlot: string;
  location: string;
  teacher: string;
  project: string;
  remainingSlots: number;
  capacity: number;
}

interface Appointment {
  id: string;
  studentId: string;
  batchId: string;
  status: string;
  batchName: string;
  studentName: string;
  date: string;
  timeSlot: string;
  location: string;
  project: string;
  createdAt: string;
}

interface ScoreItem {
  name: string;
  score: number | null;
  remarks: string;
}

interface Score {
  id: string;
  studentId: string;
  batchId: string;
  batchName: string;
  testDate: string;
  totalScore: number;
  level: string;
  items: ScoreItem[];
}

interface Notice {
  id: string;
  title: string;
  content: string;
  priority: string;
  author: string;
  publishDate: string;
  attachments?: string[];
}

interface StudentState {
  user: User | null;
  profile: Student | null;
  isLoggedIn: boolean;
  batches: Batch[];
  appointments: Appointment[];
  scores: Score[];
  notices: Notice[];
}

const state = reactive<StudentState>({
  user: null,
  profile: null,
  isLoggedIn: false,
  batches: [],
  appointments: [],
  scores: [],
  notices: []
});

const currentUser = computed(() => {
  if (!state.user) return null;
  return {
    id: state.user.id,
    name: state.user.name || state.profile?.name || state.user.nickname || '',
    avatar: state.user.avatar || '/static/avatar.png',
    studentId: state.user.studentId || state.user.username || '',
    class: state.user.class || state.profile?.class || '',
    gender: state.user.gender || state.profile?.gender || '',
    phone: state.profile?.phone || ''
  };
});

const userStats = computed(() => {
  const totalAppointments = state.appointments.length;
  const completedAppointments = state.appointments.filter(a => a.status === 'completed').length;
  const totalScores = state.scores.length;
  const averageScore = state.scores.length > 0
    ? Math.round(state.scores.reduce((sum, s) => sum + s.totalScore, 0) / state.scores.length * 10) / 10
    : 0;
  return { totalAppointments, completedAppointments, totalScores, averageScore };
});

const availableBatches = computed(() => {
  return state.batches.filter(b => b.status === 'open');
});

async function login(studentId: string, password: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.auth.login({ username: studentId, password });

    if (response.success) {
      state.user = response.data.user;
      state.profile = response.data.profile;
      state.isLoggedIn = true;
      setToken(response.data.token);
      return { success: true, message: '登录成功' };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error: any) {
    console.error('Login error:', error);
    const message = error?.message || '登录失败，请检查网络连接';
    return { success: false, message };
  }
}

async function wechatLogin(code: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.auth.wechatLogin({ code });

    if (response.success) {
      state.user = response.data.user;
      state.isLoggedIn = true;
      setToken(response.data.token);
      return { success: true, message: '微信登录成功' };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error: any) {
    console.error('WeChat login error:', error);
    const message = error?.message || '微信登录失败';
    return { success: false, message };
  }
}

function logout() {
  state.user = null;
  state.profile = null;
  state.isLoggedIn = false;
  state.appointments = [];
  state.scores = [];
  state.batches = [];
  state.notices = [];
  clearToken();
}

async function getProfile(): Promise<void> {
  try {
    const response = await api.auth.getMe();
    if (response.success) {
      state.user = response.data.user;
      state.profile = response.data.profile;
    }
  } catch (error) {
    console.error('Get profile error:', error);
  }
}

async function loadBatches(): Promise<void> {
  console.log('[Store] loadBatches called, token:', getToken() ? 'exists' : 'missing');
  try {
    const response = await api.batches.getAll();
    if (response.success) {
      state.batches = response.data.map((b: any) => ({
        id: b.id,
        name: b.name,
        startDate: b.start_date || b.startDate,
        endDate: b.end_date || b.endDate,
        status: b.status,
        maxCapacity: b.max_capacity || b.maxCapacity || 0,
        currentCount: b.current_count || b.currentCount || 0,
        date: b.date || b.start_date || b.startDate || '',
        timeSlot: b.time_slot || b.timeSlot || '',
        location: b.location || '',
        teacher: b.teacher || '',
        project: b.project || '',
        remainingSlots: b.remainingSlots ?? (b.max_capacity || b.maxCapacity || 0) - (b.current_count || b.currentCount || 0),
        capacity: b.capacity || b.max_capacity || b.maxCapacity || 0
      }));
    }
  } catch (error) {
    console.error('Load batches error:', error);
    state.batches = [];
  }
}

async function loadAppointments(): Promise<void> {
  console.log('[Store] loadAppointments called, user:', state.user?.name, 'token:', getToken() ? 'exists' : 'missing');
  try {
    const response = await api.appointments.getAll({});
    if (response.success) {
      state.appointments = response.data.map((a: any) => ({
        id: a.id,
        studentId: a.student_id || a.studentId,
        batchId: a.batch_id || a.batchId,
        status: a.status,
        batchName: a.batch_name || a.batchName || a.batch_id || a.batchId,
        studentName: a.student_name || a.studentName || a.student_id || a.studentId,
        date: a.date || (a.appointment_time ? a.appointment_time.split(' ')[0] : '') || '',
        timeSlot: a.time_slot || a.timeSlot || '',
        location: a.location || '',
        project: a.project || '',
        createdAt: a.created_at || a.createdAt
      }));
    }
  } catch (error) {
    console.error('Load appointments error:', error);
    state.appointments = [];
  }
}

async function createAppointment(batchId: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.appointments.create({ batchId });
    if (response.success) {
      await loadAppointments();
      await loadBatches();
      return { success: true, message: '预约成功' };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error: any) {
    console.error('Create appointment error:', error);
    return { success: false, message: error?.message || '预约失败，请检查网络连接' };
  }
}

async function cancelAppointment(appointmentId: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.appointments.delete(appointmentId);
    if (response.success) {
      await loadAppointments();
      await loadBatches();
      return { success: true, message: '取消成功' };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error: any) {
    console.error('Cancel appointment error:', error);
    return { success: false, message: error?.message || '取消失败，请检查网络连接' };
  }
}

function searchBatches(keyword: string): Batch[] {
  if (!keyword) return availableBatches.value;
  const kw = keyword.toLowerCase();
  return availableBatches.value.filter(b =>
    b.name.toLowerCase().includes(kw) ||
    b.location.toLowerCase().includes(kw) ||
    b.teacher.toLowerCase().includes(kw) ||
    b.project.toLowerCase().includes(kw)
  );
}

function filterBatches(filters: { date?: string; location?: string }): Batch[] {
  let result = availableBatches.value;
  if (filters.date) {
    result = result.filter(b => b.date === filters.date || b.startDate === filters.date);
  }
  if (filters.location && filters.location !== '全部') {
    result = result.filter(b => b.location === filters.location);
  }
  return result;
}

async function appointBatch(batchId: string): Promise<{ success: boolean; message: string }> {
  return await createAppointment(batchId);
}

async function loadScores(): Promise<void> {
  console.log('[Store] loadScores called, user:', state.user?.name, 'token:', getToken() ? 'exists' : 'missing');
  try {
    const response = await api.scores.getAll({});
    if (response.success) {
      state.scores = response.data.map((s: any) => ({
        id: s.id || s.batch_id || s.batchId,
        studentId: s.student_id || s.studentId || '',
        batchId: s.batch_id || s.batchId || '',
        batchName: s.batch_name || s.batchName || s.batch_id || s.batchId || '',
        testDate: s.test_date || s.testDate || (s.entered_at ? (s.entered_at || '').split('T')[0] : ''),
        totalScore: s.totalScore || 0,
        level: s.level || '',
        items: s.items || [{
          name: s.project_name || s.projectName || s.project_id || s.projectId || '',
          score: s.score ?? null,
          remarks: s.remarks || ''
        }]
      }));
    }
  } catch (error) {
    console.error('Load scores error:', error);
    state.scores = [];
  }
}

async function loadNotices(): Promise<void> {
  try {
    const response = await api.notices.getAll();
    if (response.success) {
      state.notices = response.data.map((n: any) => ({
        id: n.id,
        title: n.title,
        content: n.content,
        priority: n.priority,
        author: n.author || '管理员',
        publishDate: n.publishDate || n.publish_date || (n.created_at ? n.created_at.split('T')[0] : ''),
        attachments: n.attachments || []
      }));
    }
  } catch (error) {
    console.error('Load notices error:', error);
    state.notices = [];
  }
}

export function useStudentStore() {
  return {
    state,
    get currentUser() { return currentUser.value },
    get userStats() { return userStats.value },
    get availableBatches() { return availableBatches.value },
    get notices() { return state.notices },
    get batches() { return state.batches },
    get appointments() { return state.appointments },
    get scores() { return state.scores },
    login,
    wechatLogin,
    logout,
    getProfile,
    loadBatches,
    loadAppointments,
    createAppointment,
    cancelAppointment,
    searchBatches,
    filterBatches,
    appointBatch,
    loadScores,
    loadNotices
  };
}
