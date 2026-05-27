<template>
  <view class="dashboard-container">
    <view class="header">
      <text class="title">教师仪表板</text>
      <view class="user-info">
        <text class="welcome">欢迎，{{ currentUser?.name }}</text>
        <button class="logout-btn" @click="handleLogout">退出</button>
      </view>
    </view>

    <view class="stats-section">
      <view class="stat-card">
        <text class="stat-value">{{ userStats.totalBatches }}</text>
        <text class="stat-label">管理批次</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ userStats.totalAppointments }}</text>
        <text class="stat-label">预约总数</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ userStats.completedAppointments }}</text>
        <text class="stat-label">已完成</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ userStats.totalScores }}</text>
        <text class="stat-label">已录入成绩</text>
      </view>
    </view>

    <view class="batch-section">
      <view class="section-header">
        <text class="section-title">管理的批次</text>
        <button class="view-all-btn" @click="navigateToAppointments">查看全部</button>
      </view>

      <view class="batch-list">
        <view class="batch-card" v-for="batch in batches" :key="batch.id">
          <text class="batch-name">{{ batch.name }}</text>
          <text class="batch-date">{{ batch.date }} {{ batch.timeSlot }}</text>
          <text class="batch-location">{{ batch.location }}</text>
          <view class="batch-status" :class="'status-' + batch.status">
            {{ getStatusText(batch.status) }}
          </view>
          <button class="batch-btn" @click="viewAppointments(batch.id)">
            查看预约
          </button>
        </view>
      </view>
    </view>

    <view class="quick-actions">
      <view class="action-card" @click="navigateToAppointments">
        <text class="action-icon">📋</text>
        <text class="action-text">预约管理</text>
      </view>
      <view class="action-card" @click="navigateToScoreEntry">
        <text class="action-icon">📝</text>
        <text class="action-text">成绩录入</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useTeacherStore } from '@/stores/teacher'

const store = useTeacherStore()

onShow(async () => {
  await Promise.all([
    store.loadBatches(),
    store.loadAppointments(),
    store.loadScores()
  ])
})

const currentUser = computed(() => store.currentUser)
const userStats = computed(() => store.userStats)
const batches = computed(() => store.batches)

const getStatusText = (status: string) => {
  const statusMap = {
    open: '开放',
    closed: '关闭',
    completed: '已完成'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const handleLogout = () => {
  store.logout()
  uni.reLaunch({
    url: '/pages/teacher/login'
  })
}

const navigateToAppointments = () => {
  uni.navigateTo({
    url: '/pages/teacher/appointments'
  })
}

const navigateToScoreEntry = () => {
  uni.navigateTo({
    url: '/pages/teacher/score-entry'
  })
}

const viewAppointments = (batchId: string) => {
  uni.navigateTo({
    url: `/pages/teacher/appointments?batchId=${batchId}`
  })
}
</script>

<style scoped>
.dashboard-container {
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

.user-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.welcome {
  font-size: 28rpx;
  color: #666;
}

.logout-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 8rpx;
  padding: 8rpx 16rpx;
  font-size: 24rpx;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 32rpx;
}

.stat-card {
  background: white;
  padding: 32rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  text-align: center;
}

.stat-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}

.batch-section {
  margin-bottom: 32rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.view-all-btn {
  background-color: #f0f0f0;
  color: #666;
  border: none;
  border-radius: 8rpx;
  padding: 8rpx 16rpx;
  font-size: 24rpx;
}

.batch-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.batch-card {
  background: white;
  padding: 32rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.batch-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.batch-date {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.batch-location {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 16rpx;
}

.batch-status {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.status-open {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-closed {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.status-completed {
  background-color: #e6f7ff;
  color: #1890ff;
}

.batch-btn {
  width: 100%;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 8rpx;
  padding: 12rpx 0;
  font-size: 24rpx;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.action-card {
  background: white;
  padding: 40rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  text-align: center;
  cursor: pointer;
}

.action-icon {
  font-size: 64rpx;
  display: block;
  margin-bottom: 16rpx;
}

.action-text {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}
</style>