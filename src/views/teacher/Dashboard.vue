<template>
  <div class="dashboard-container">
    <!-- 欢迎卡片 -->
    <a-card class="welcome-card">
      <template #title>
        <h2>👋 欢迎, {{ currentTeacher?.name }}!</h2>
      </template>
      <p class="welcome-text">
        您已登录教师管理平台，可以查看学生预约、录入体测成绩等工作。
      </p>
    </a-card>

    <!-- 工作统计 -->
    <a-row :gutter="[16, 16]" style="margin-bottom: 20px">
      <a-col :xs="24" :sm="12" :lg="6">
        <a-statistic-card title="负责批次" :value="teacherStats.totalBatches">
          <template #prefix>📋</template>
        </a-statistic-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-statistic-card title="学生预约" :value="teacherStats.totalAppointments">
          <template #prefix>👥</template>
        </a-statistic-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-statistic-card title="已提交成绩" :value="teacherStats.submittedScores" value-style="color: #52C41A">
          <template #prefix>✓</template>
        </a-statistic-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-statistic-card title="待录入成绩" :value="teacherStats.draftScores" value-style="color: #FAAD14">
          <template #prefix>📝</template>
        </a-statistic-card>
      </a-col>
    </a-row>

    <!-- 负责批次 -->
    <a-card title="📋 我的体测批次" class="batches-card">
      <a-row :gutter="[16, 16]">
        <a-col v-for="batch in assignedBatches" :key="batch.id" :xs="24" :sm="12" :lg="8">
          <div class="batch-card">
            <div class="batch-header">
              <h3>{{ batch.name }}</h3>
              <a-tag :color="getBatchStatusColor(batch.status)">{{ batch.status }}</a-tag>
            </div>

            <div class="batch-info">
              <p>
                <strong>项目:</strong> {{ batch.project }}
              </p>
              <p>
                <strong>地点:</strong> {{ batch.location }}
              </p>
              <p>
                <strong>日期:</strong> {{ batch.date }}
              </p>
              <p>
                <strong>时段:</strong> {{ batch.timeSlot }}
              </p>
              <p>
                <strong>已预约:</strong>
                <span class="count">{{ getAppointmentCount(batch.id) }}/{{ batch.totalSlots }}</span>
              </p>
            </div>

            <div class="batch-actions">
              <a-button type="primary" size="small" @click="goToAppointments(batch.id)">
                查看预约 →
              </a-button>
              <a-button size="small" @click="goToScoreEntry(batch.id)">
                录入成绩 →
              </a-button>
            </div>
          </div>
        </a-col>
      </a-row>

      <a-empty v-if="assignedBatches.length === 0" description="暂无负责的体测批次" />
    </a-card>

    <!-- 快速操作 -->
    <a-card title="🚀 快速操作" class="quick-actions" style="margin-top: 20px">
      <a-button-group>
        <a-button type="primary" @click="$router.push('/teacher/appointments')">
          📊 查看全部预约
        </a-button>
        <a-button @click="$router.push('/teacher/score-entry')">
          📝 录入成绩
        </a-button>
        <a-button danger @click="handleLogout">
          🚪 退出登录
        </a-button>
      </a-button-group>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useTeacherStore } from '@/stores/teacher'

const router = useRouter()
const store = useTeacherStore()

const currentTeacher = computed(() => store.currentTeacher)
const assignedBatches = computed(() => store.assignedBatches)

const teacherStats = computed(() => ({
  totalBatches: assignedBatches.value.length,
  totalAppointments: store.getAllAppointments().length,
  submittedScores: store.scoreEntries.filter((s) => s.status === 'submitted').length,
  draftScores: store.scoreEntries.filter((s) => s.status === 'draft').length,
}))

const getBatchStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    open: 'green',
    closed: 'red',
    cancelled: 'default',
  }
  return colors[status] || 'default'
}

const getAppointmentCount = (batchId: string) => {
  return store.getAppointmentsByBatch(batchId).length
}

const goToAppointments = (batchId: string) => {
  router.push({ path: '/teacher/appointments', query: { batchId } })
}

const goToScoreEntry = (batchId: string) => {
  router.push({ path: '/teacher/score-entry', query: { batchId } })
}

const handleLogout = () => {
  store.logout()
  message.success('已退出登录')
  router.push('/teacher/login')
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.welcome-card {
  background: linear-gradient(135deg, #ff7a45 0%, #ff5722 100%);
  color: white;
  border: none;
}

:deep(.welcome-card .ant-card-head) {
  border-bottom: none;
  padding-bottom: 0;
}

:deep(.welcome-card .ant-card-head h2) {
  color: white;
}

:deep(.welcome-card .ant-card-body) {
  background: white;
  color: #333;
}

.welcome-text {
  margin: 0;
  color: #666;
}

:deep(.ant-statistic-card) {
  border-radius: 8px;
}

.batch-card {
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
}

.batch-card:hover {
  border-color: #ff7a45;
  box-shadow: 0 4px 12px rgba(255, 122, 69, 0.15);
}

.batch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.batch-header h3 {
  margin: 0;
  font-size: 16px;
}

.batch-info {
  margin: 12px 0;
}

.batch-info p {
  margin: 6px 0;
  font-size: 13px;
  color: #666;
}

.count {
  font-weight: bold;
  color: #ff7a45;
}

.batch-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

:deep(.ant-button-group) {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 响应式 */
@media (max-width: 768px) {
  .batch-actions {
    flex-direction: column;
  }
}
</style>
