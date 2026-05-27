<template>
  <div class="profile-container">
    <a-card class="profile-card">
      <!-- 个人信息卡片 -->
      <div class="profile-header">
        <div class="profile-avatar">👨‍🎓</div>
        <div class="profile-info">
          <h2>{{ currentUser?.name }}</h2>
          <p>{{ currentUser?.major }}</p>
        </div>
      </div>

      <a-divider />

      <!-- 基本信息 -->
      <a-descriptions title="📋 基本信息" :column="1" bordered>
        <a-descriptions-item label="姓名">
          {{ currentUser?.name }}
        </a-descriptions-item>
        <a-descriptions-item label="学号">
          {{ currentUser?.studentId }}
        </a-descriptions-item>
        <a-descriptions-item label="班级">
          {{ currentUser?.class }}
        </a-descriptions-item>
        <a-descriptions-item label="专业">
          {{ currentUser?.major }}
        </a-descriptions-item>
        <a-descriptions-item label="联系电话">
          {{ currentUser?.phone }}
        </a-descriptions-item>
      </a-descriptions>

      <!-- 预约统计 -->
      <a-card title="📅 预约统计" class="statistics-card" style="margin-top: 20px">
        <a-row :gutter="[16, 16]">
          <a-col :xs="12" :sm="6">
            <div class="stat-box">
              <div class="stat-number">{{ userStats.totalAppointments }}</div>
              <div class="stat-label">总预约数</div>
            </div>
          </a-col>
          <a-col :xs="12" :sm="6">
            <div class="stat-box">
              <div class="stat-number">{{ userStats.confirmedAppointments }}</div>
              <div class="stat-label">已确认</div>
            </div>
          </a-col>
          <a-col :xs="12" :sm="6">
            <div class="stat-box">
              <div class="stat-number">{{ userStats.completedAppointments }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </a-col>
          <a-col :xs="12" :sm="6">
            <div class="stat-box">
              <div class="stat-number">{{ cancelledCount }}</div>
              <div class="stat-label">已取消</div>
            </div>
          </a-col>
        </a-row>
      </a-card>

      <!-- 成绩统计 -->
      <a-card title="📊 成绩统计" class="statistics-card" style="margin-top: 20px">
        <a-row :gutter="[16, 16]">
          <a-col :xs="12" :sm="6">
            <div class="stat-box">
              <div class="stat-number">{{ userStats.totalScores }}</div>
              <div class="stat-label">参测次数</div>
            </div>
          </a-col>
          <a-col :xs="12" :sm="6">
            <div class="stat-box">
              <div class="stat-number">{{ userStats.averageScore }}</div>
              <div class="stat-label">平均分</div>
            </div>
          </a-col>
          <a-col :xs="12" :sm="6">
            <div class="stat-box">
              <div class="stat-number">{{ passedCount }}</div>
              <div class="stat-label">合格次数</div>
            </div>
          </a-col>
          <a-col :xs="12" :sm="6">
            <div class="stat-box">
              <div class="stat-number">{{ highestScore }}</div>
              <div class="stat-label">最高分</div>
            </div>
          </a-col>
        </a-row>
      </a-card>

      <!-- 操作按钮 -->
      <div class="action-buttons" style="margin-top: 30px">
        <a-space>
          <a-button type="primary" @click="handleViewAppointments">
            查看我的预约
          </a-button>
          <a-button @click="handleViewScores">
            查看我的成绩
          </a-button>
          <a-button danger @click="handleLogout">
            退出登录
          </a-button>
        </a-space>
      </div>

      <!-- 帮助信息 -->
      <a-alert
        type="info"
        message="需要帮助？"
        description="如有任何问题，请联系体育教学部 0551-63612345"
        show-icon
        closable
        style="margin-top: 20px"
      />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useStudentStore } from '@/stores/student'

const router = useRouter()
const store = useStudentStore()

const currentUser = computed(() => store.currentUser)
const userStats = computed(() => store.userStats)

const cancelledCount = computed(() => store.appointments.filter((a) => a.status === 'cancelled').length)

const passedCount = computed(() => store.scores.filter((s) => s.status === 'pass').length)

const highestScore = computed(() => {
  if (store.scores.length === 0) return 0
  return Math.max(...store.scores.map((s) => s.totalScore))
})

const handleViewAppointments = () => {
  router.push('/student/my-appointments')
}

const handleViewScores = () => {
  router.push('/student/scores')
}

const handleLogout = () => {
  store.logout()
  message.success('已退出登录')
  router.push('/student/login')
}
</script>

<style scoped>
.profile-container {
  padding-bottom: 80px;
}

.profile-card {
  border-radius: 8px;
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  text-align: left;
  margin-bottom: 16px;
}

.profile-avatar {
  font-size: 60px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 8px;
}

.profile-info h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.profile-info p {
  margin: 4px 0 0 0;
  color: #999;
  font-size: 14px;
}

:deep(.ant-descriptions-item-label) {
  font-weight: bold;
  background: #f5f5f5;
}

.statistics-card {
  border: 1px solid #f0f0f0;
  background: white;
}

.stat-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  color: white;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 13px;
  opacity: 0.9;
}

.action-buttons {
  text-align: center;
}

:deep(.ant-space) {
  justify-content: center;
}

/* 响应式 */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-info {
    text-align: center;
  }
}
</style>
