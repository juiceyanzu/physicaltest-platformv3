<template>
  <view class="my-appointments-container">
    <view class="tabs">
      <view
        class="tab-item"
        :class="{ active: activeTab === 'all' }"
        @click="switchTab('all')"
      >
        <text class="tab-text">全部</text>
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'confirmed' }"
        @click="switchTab('confirmed')"
      >
        <text class="tab-text">已确认</text>
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'completed' }"
        @click="switchTab('completed')"
      >
        <text class="tab-text">已完成</text>
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'cancelled' }"
        @click="switchTab('cancelled')"
      >
        <text class="tab-text">已取消</text>
      </view>
    </view>

    <view class="appointment-list">
      <view class="appointment-card" v-for="appointment in filteredAppointments" :key="appointment.id">
        <view class="appointment-header">
          <text class="appointment-title">{{ appointment.batchName }}</text>
          <view class="appointment-status" :class="'status-' + appointment.status">
            {{ getStatusText(appointment.status) }}
          </view>
        </view>

        <view class="appointment-info">
          <text class="info-item">📅 {{ appointment.date }} {{ appointment.timeSlot }}</text>
          <text class="info-item">📍 {{ appointment.location }}</text>
          <text class="info-item">🏃 {{ appointment.project }}</text>
          <text class="info-item">⏰ 预约时间：{{ formatDate(appointment.createdAt) }}</text>
        </view>

        <view class="appointment-actions" v-if="appointment.status === 'confirmed'">
          <button class="action-btn cancel-btn" @click="handleCancel(appointment.id)">
            取消预约
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
import { useStudentStore } from '@/stores/student'
import { getToken } from '@/api'

const store = useStudentStore()
const activeTab = ref('all')
const appointmentsList = ref<Appointment[]>([])

const refreshData = async () => {
  await store.loadAppointments()
  await store.loadBatches()
  appointmentsList.value = store.state.appointments.slice()
}

onShow(async () => {
  if (!store.state.user && getToken()) {
    await store.getProfile()
  }
  await refreshData()
})

const filteredAppointments = computed(() => {
  if (activeTab.value === 'all') {
    return appointmentsList.value
  }
  return appointmentsList.value.filter(a => a.status === activeTab.value)
})

const switchTab = (tab: string) => {
  activeTab.value = tab
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleCancel = (appointmentId: string) => {
  uni.showModal({
    title: '取消预约',
    content: '确定要取消这个预约吗？',
    success: async (res) => {
      if (res.confirm) {
        const result = await store.cancelAppointment(appointmentId)
        if (result.success) {
          await refreshData()
          uni.showToast({
            title: result.message,
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: result.message,
            icon: 'none'
          })
        }
      }
    }
  })
}
</script>

<style scoped>
.my-appointments-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.tabs {
  display: flex;
  background: white;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  position: relative;
}

.tab-text {
  font-size: 28rpx;
  color: #666;
}

.tab-item.active .tab-text {
  color: #1890ff;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 4rpx;
  background-color: #1890ff;
  border-radius: 2rpx;
}

.appointment-list {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.appointment-card {
  background: white;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.appointment-title {
  flex: 1;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-right: 16rpx;
}

.appointment-status {
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
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
  background-color: #f0f0f0;
  color: #999;
}

.appointment-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 24rpx;
}

.info-item {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.appointment-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  flex: 1;
  height: 64rpx;
  border: none;
  border-radius: 32rpx;
  font-size: 28rpx;
  font-weight: bold;
}

.cancel-btn {
  background-color: #ff4d4f;
  color: white;
}

.cancel-btn::after {
  border: none;
}

.empty-state {
  text-align: center;
  padding: 120rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>