<template>
  <view class="profile-container">
    <view class="profile-header">
      <image class="avatar" :src="currentUser?.avatar || '/static/avatar.png'" mode="aspectFill" />
      <view class="user-info">
        <text class="username">{{ currentUser?.name || '同学' }}</text>
        <text class="user-id">学号：{{ currentUser?.studentId || '' }}</text>
        <text class="user-class">{{ currentUser?.class || '' }}</text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" @click="goToMyAppointments">
        <view class="menu-left">
          <text class="menu-icon">📋</text>
          <text class="menu-text">我的预约</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>

      <view class="menu-item" @click="goToScores">
        <view class="menu-left">
          <text class="menu-icon">📊</text>
          <text class="menu-text">我的成绩</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>

      <view class="menu-item" @click="goToNotices">
        <view class="menu-left">
          <text class="menu-icon">🔔</text>
          <text class="menu-text">公告通知</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" @click="handleEditProfile">
        <view class="menu-left">
          <text class="menu-icon">✏️</text>
          <text class="menu-text">编辑资料</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>

      <view class="menu-item" @click="handleChangePassword">
        <view class="menu-left">
          <text class="menu-icon">🔒</text>
          <text class="menu-text">修改密码</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>

      <view class="menu-item" @click="handleAbout">
        <view class="menu-left">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">关于我们</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" @click="handleFeedback">
        <view class="menu-left">
          <text class="menu-icon">💬</text>
          <text class="menu-text">意见反馈</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>

      <view class="menu-item" @click="handleContact">
        <view class="menu-left">
          <text class="menu-icon">📞</text>
          <text class="menu-text">联系我们</text>
        </view>
        <text class="menu-arrow">→</text>
      </view>
    </view>

    <button class="logout-btn" @click="handleLogout">退出登录</button>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStudentStore } from '@/stores/student'

const store = useStudentStore()

const currentUser = computed(() => store.currentUser)

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

const goToNotices = () => {
  uni.navigateTo({
    url: '/pages/student/notices'
  })
}

const handleEditProfile = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const handleChangePassword = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const handleAbout = () => {
  uni.showModal({
    title: '关于我们',
    content: '体测预约平台 v1.0.0\n为学生提供便捷的体测预约服务',
    showCancel: false
  })
}

const handleFeedback = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

const handleContact = () => {
  uni.showModal({
    title: '联系我们',
    content: '体育部电话：010-12345678\n邮箱：sports@university.edu.cn',
    showCancel: false
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        store.logout()
        uni.reLaunch({
          url: '/pages/student/login'
        })
      }
    }
  })
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.profile-header {
  background: #667eea;
  padding: 60rpx 40rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 32rpx;
  background-color: white;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 36rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 12rpx;
}

.user-id,
.user-class {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8rpx;
}

.menu-section {
  background: white;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 24rpx;
}

.menu-text {
  font-size: 28rpx;
  color: #333;
}

.menu-arrow {
  font-size: 32rpx;
  color: #ccc;
}

.logout-btn {
  width: 100%;
  height: 88rpx;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 32rpx;
}

.logout-btn::after {
  border: none;
}
</style>