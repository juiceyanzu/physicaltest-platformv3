<template>
  <view class="dashboard-container">
    <view class="header">
      <text class="title">管理中心</text>
      <view class="user-info">
        <text class="welcome">欢迎，{{ currentUser?.name }}</text>
        <button class="logout-btn" @click="handleLogout">退出</button>
      </view>
    </view>

    <view class="stats-section">
      <view class="stat-card">
        <text class="stat-value">{{ users.length }}</text>
        <text class="stat-label">用户总数</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ batches.length }}</text>
        <text class="stat-label">体测批次</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ projects.length }}</text>
        <text class="stat-label">体测项目</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ notices.length }}</text>
        <text class="stat-label">公告数量</text>
      </view>
    </view>

    <view class="quick-actions">
      <view class="action-card" @click="navigateToUsers">
        <text class="action-icon">👥</text>
        <text class="action-text">用户管理</text>
      </view>
      <view class="action-card" @click="navigateToBatches">
        <text class="action-icon">📅</text>
        <text class="action-text">批次管理</text>
      </view>
      <view class="action-card" @click="navigateToProjects">
        <text class="action-icon">🏃</text>
        <text class="action-text">项目管理</text>
      </view>
      <view class="action-card" @click="navigateToNotices">
        <text class="action-icon">📢</text>
        <text class="action-text">公告管理</text>
      </view>
      <view class="action-card" @click="navigateToBanners">
        <text class="action-icon">🖼️</text>
        <text class="action-text">横幅管理</text>
      </view>
    </view>

    <view class="recent-section">
      <view class="section-header">
        <text class="section-title">最近公告</text>
        <button class="view-all-btn" @click="navigateToNotices">查看全部</button>
      </view>

      <view class="notice-list">
        <view class="notice-card" v-for="notice in recentNotices" :key="notice.id">
          <text class="notice-title">{{ notice.title }}</text>
          <text class="notice-date">{{ notice.publishDate }}</text>
          <text class="notice-author">发布者：{{ notice.author }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAdminStore } from '@/stores/admin'

const store = useAdminStore()

const currentUser = computed(() => store.currentUser)
const users = computed(() => store.users)
const batches = computed(() => store.batches)
const projects = computed(() => store.projects)
const notices = computed(() => store.notices)
const banners = computed(() => store.banners)

const recentNotices = computed(() => {
  return notices.value.slice(0, 3)
})

const handleLogout = () => {
  store.logout()
  uni.reLaunch({
    url: '/pages/admin/login'
  })
}

const navigateToUsers = () => {
  uni.navigateTo({
    url: '/pages/admin/users'
  })
}

const navigateToBatches = () => {
  uni.navigateTo({
    url: '/pages/admin/batches'
  })
}

const navigateToProjects = () => {
  uni.navigateTo({
    url: '/pages/admin/projects'
  })
}

const navigateToNotices = () => {
  uni.navigateTo({
    url: '/pages/admin/notices'
  })
}

const navigateToBanners = () => {
  uni.navigateTo({
    url: '/pages/admin/banners'
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

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-bottom: 32rpx;
}

.action-card {
  background: white;
  padding: 40rpx 20rpx;
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
  font-size: 24rpx;
  color: #333;
  font-weight: bold;
}

.recent-section {
  background: white;
  padding: 32rpx;
  border-radius: 16rpx;
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

.view-all-btn {
  background-color: #f0f0f0;
  color: #666;
  border: none;
  border-radius: 8rpx;
  padding: 8rpx 16rpx;
  font-size: 24rpx;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.notice-card {
  padding: 24rpx;
  border-left: 4rpx solid #1890ff;
  background-color: #f9f9f9;
  border-radius: 8rpx;
}

.notice-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.notice-date {
  font-size: 20rpx;
  color: #999;
  margin-bottom: 4rpx;
  display: block;
}

.notice-author {
  font-size: 20rpx;
  color: #999;
  display: block;
}
</style>