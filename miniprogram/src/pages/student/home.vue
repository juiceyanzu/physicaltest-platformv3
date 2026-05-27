<template>
  <view class="home-container">
    <view class="header">
      <view class="user-info">
        <image class="avatar" :src="currentUser?.avatar || '/static/avatar.png'" mode="aspectFill" />
        <view class="user-details">
          <text class="username">{{ currentUser?.name || '同学' }}</text>
          <text class="user-class">{{ currentUser?.class || '' }}</text>
        </view>
      </view>
      <view class="notification" @click="goToNotices">
        <text class="icon">🔔</text>
        <text class="badge" v-if="unreadCount > 0">{{ unreadCount }}</text>
      </view>
    </view>

    <view class="stats-section">
      <view class="stat-card">
        <text class="stat-value">{{ userStats.totalAppointments }}</text>
        <text class="stat-label">总预约</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ userStats.completedAppointments }}</text>
        <text class="stat-label">已完成</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ userStats.totalScores }}</text>
        <text class="stat-label">成绩记录</text>
      </view>
    </view>

    <view class="quick-actions">
      <view class="action-item" @click="goToAppointments">
        <view class="action-icon">📅</view>
        <text class="action-text">预约体测</text>
      </view>
      <view class="action-item" @click="goToMyAppointments">
        <view class="action-icon">📋</view>
        <text class="action-text">我的预约</text>
      </view>
      <view class="action-item" @click="goToScores">
        <view class="action-icon">📊</view>
        <text class="action-text">我的成绩</text>
      </view>
      <view class="action-item" @click="goToProfile">
        <view class="action-icon">👤</view>
        <text class="action-text">个人中心</text>
      </view>
    </view>

    <view class="notice-section">
      <view class="section-header">
        <text class="section-title">最新公告</text>
        <text class="section-more" @click="goToNotices">查看更多 →</text>
      </view>
      <view class="notice-list">
        <view class="notice-item" v-for="notice in recentNotices" :key="notice.id" @click="goToNoticeDetail(notice.id)">
          <view class="notice-content">
            <text class="notice-title">{{ notice.title }}</text>
            <text class="notice-date">{{ notice.publishDate }}</text>
          </view>
          <view class="notice-tag" :class="'tag-' + notice.priority">
            {{ notice.priority === 'high' ? '重要' : notice.priority === 'normal' ? '普通' : '低' }}
          </view>
        </view>
      </view>
    </view>

    <view class="upcoming-section" v-if="upcomingAppointment">
      <view class="section-header">
        <text class="section-title">即将到来的体测</text>
      </view>
      <view class="upcoming-card">
        <view class="upcoming-info">
          <text class="upcoming-title">{{ upcomingAppointment.batchName }}</text>
          <text class="upcoming-time">📅 {{ upcomingAppointment.date }} {{ upcomingAppointment.timeSlot }}</text>
          <text class="upcoming-location">📍 {{ upcomingAppointment.location }}</text>
        </view>
        <view class="upcoming-status" :class="'status-' + upcomingAppointment.status">
          {{ upcomingAppointment.status === 'confirmed' ? '已确认' : '已完成' }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useStudentStore } from '@/stores/student'
import { getToken } from '@/api'

const store = useStudentStore()

onShow(async () => {
  // If user state is lost (e.g. after reLaunch), restore from token
  if (!store.state.user && getToken()) {
    await store.getProfile()
  }
  store.loadBatches()
  store.loadAppointments()
  store.loadScores()
  store.loadNotices()
})

const currentUser = computed(() => store.currentUser)
const userStats = computed(() => store.userStats)
const recentNotices = computed(() => store.notices.slice(0, 3))
const unreadCount = computed(() => store.notices.filter(n => n.priority === 'high').length)

const upcomingAppointment = computed(() => {
  const confirmed = store.appointments.filter(a => a.status === 'confirmed')
  if (confirmed.length > 0) {
    return confirmed.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
  }
  return null
})

const goToNotices = () => {
  uni.navigateTo({
    url: '/pages/student/notices'
  })
}

const goToNoticeDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/student/notice-detail?id=${id}`
  })
}

const goToAppointments = () => {
  uni.switchTab({
    url: '/pages/student/appointments'
  })
}

const goToMyAppointments = () => {
  uni.navigateTo({
    url: '/pages/student/my-appointments'
  })
}

const goToScores = () => {
  uni.switchTab({
    url: '/pages/student/scores'
  })
}

const goToProfile = () => {
  uni.switchTab({
    url: '/pages/student/profile'
  })
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.header {
  background: #667eea;
  padding: 40rpx;
  border-radius: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 24rpx;
  background-color: white;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 32rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 8rpx;
}

.user-class {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.notification {
  position: relative;
  padding: 16rpx;
}

.icon {
  font-size: 48rpx;
}

.badge {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  background-color: #ff4d4f;
  color: white;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  min-width: 32rpx;
  text-align: center;
}

.stats-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32rpx;
}

.stat-card {
  flex: 1;
  background: white;
  padding: 32rpx 16rpx;
  border-radius: 16rpx;
  text-align: center;
  margin: 0 8rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.stat-value {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 8rpx;
}

.stat-label {
  display: block;
  font-size: 24rpx;
  color: #666;
}

.quick-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32rpx;
}

.action-item {
  flex: 1;
  background: white;
  padding: 32rpx 16rpx;
  border-radius: 16rpx;
  text-align: center;
  margin: 0 8rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.action-icon {
  font-size: 56rpx;
  margin-bottom: 16rpx;
}

.action-text {
  display: block;
  font-size: 24rpx;
  color: #333;
}

.notice-section,
.upcoming-section {
  background: white;
  padding: 32rpx;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.section-more {
  font-size: 24rpx;
  color: #1890ff;
}

.notice-list {
  display: flex;
  flex-direction: column;
}

.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.notice-item:last-child {
  border-bottom: none;
}

.notice-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.notice-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.notice-date {
  font-size: 24rpx;
  color: #999;
}

.notice-tag {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
  margin-left: 16rpx;
}

.tag-high {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.tag-normal {
  background-color: #e6f7ff;
  color: #1890ff;
}

.tag-low {
  background-color: #f6ffed;
  color: #52c41a;
}

.upcoming-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upcoming-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.upcoming-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.upcoming-time,
.upcoming-location {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.upcoming-status {
  padding: 12rpx 24rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: bold;
}

.status-confirmed {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-completed {
  background-color: #f6ffed;
  color: #52c41a;
}
</style>