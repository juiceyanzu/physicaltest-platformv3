<template>
  <view class="appointments-container">
    <view class="header">
      <text class="title">预约管理</text>
      <button class="back-btn" @click="navigateBack">返回</button>
    </view>

    <view class="filter-section">
      <view class="filter-item">
        <text class="filter-label">批次</text>
        <picker :range="batchOptions" :value="selectedBatch" @change="handleBatchChange">
          <view class="picker-content">
            {{ selectedBatchName }}
          </view>
        </picker>
      </view>
    </view>

    <view class="appointment-list">
      <view class="appointment-card" v-for="appointment in filteredAppointments" :key="appointment.id">
        <view class="appointment-header">
          <text class="student-name">{{ appointment.studentName }}</text>
          <view class="appointment-status" :class="'status-' + appointment.status">
            {{ getStatusText(appointment.status) }}
          </view>
        </view>

        <view class="appointment-info">
          <text class="info-item">📅 {{ appointment.date }} {{ appointment.timeSlot }}</text>
          <text class="info-item">📍 {{ appointment.location }}</text>
          <text class="info-item">🏃 {{ appointment.project }}</text>
          <text class="info-item">🕒 预约时间：{{ formatTime(appointment.createdAt) }}</text>
        </view>

        <view class="appointment-actions">
          <button 
            class="action-btn primary" 
            @click="markComplete(appointment.id)"
            v-if="appointment.status === 'confirmed'"
          >
            标记完成
          </button>
          <button 
            class="action-btn secondary" 
            @click="viewScore(appointment)"
          >
            查看成绩
          </button>
        </view>
      </view>

      <view class="empty-state" v-if="filteredAppointments.length === 0">
        <text class="empty-text">暂无预约记录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useTeacherStore } from '@/stores/teacher'
import type { Appointment } from '@/types'

const store = useTeacherStore()
const selectedBatch = ref(-1)

onShow(async () => {
  await store.loadBatches()
  await store.loadAppointments()
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  if (options.batchId) {
    const idx = store.batches.findIndex((b: any) => b.id === options.batchId)
    if (idx >= 0) selectedBatch.value = idx
  }
})

const batches = computed(() => store.batches)
const appointments = computed(() => store.appointments)

const batchOptions = computed(() => batches.value.map(b => b.name))

const selectedBatchName = computed(() => {
  if (selectedBatch.value >= 0 && selectedBatch.value < batches.value.length) {
    return batches.value[selectedBatch.value].name
  }
  return '全部批次'
})

const filteredAppointments = computed(() => {
  if (selectedBatch.value >= 0 && selectedBatch.value < batches.value.length) {
    const batchId = batches.value[selectedBatch.value].id
    return appointments.value.filter((a: any) => a.batchId === batchId || a.batch_id === batchId)
  }
  return appointments.value
})

const getStatusText = (status: string) => {
  const statusMap = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const formatTime = (timeString: string) => {
  const date = new Date(timeString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleBatchChange = (e: any) => {
  selectedBatch.value = e.detail.value
}

const markComplete = (appointmentId: string) => {
  uni.showModal({
    title: '确认操作',
    content: '确定要标记此预约为已完成吗？',
    success: async (res) => {
      if (res.confirm) {
        const result = await store.markAppointmentComplete(appointmentId)
        uni.showToast({
          title: result.message,
          icon: result.success ? 'success' : 'none'
        })
      }
    }
  })
}

const viewScore = (appointment: Appointment) => {
  uni.navigateTo({
    url: `/pages/teacher/score-entry?studentId=${appointment.studentId}&batchId=${appointment.batchId}`
  })
}

const navigateBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.appointments-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.back-btn {
  background-color: #f0f0f0;
  color: #666;
  border: none;
  border-radius: 8rpx;
  padding: 8rpx 16rpx;
  font-size: 24rpx;
}

.filter-section {
  background: white;
  padding: 24rpx;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.filter-item {
  margin-bottom: 20rpx;
}

.filter-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
  display: block;
}

.picker-content {
  height: 80rpx;
  border: 2rpx solid #d9d9d9;
  border-radius: 8rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #333;
}

.appointment-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.appointment-card {
  background: white;
  padding: 32rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.student-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.appointment-status {
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
  font-weight: bold;
}

.status-pending {
  background-color: #fffbe6;
  color: #faad14;
}

.status-confirmed {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-completed {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-cancelled {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.appointment-info {
  margin-bottom: 24rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-item {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
}

.appointment-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  flex: 1;
  padding: 12rpx 0;
  border: none;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: bold;
}

.action-btn.primary {
  background-color: #1890ff;
  color: white;
}

.action-btn.secondary {
  background-color: #f0f0f0;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 120rpx 0;
  background: white;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>