<template>
  <view class="index-container">
    <view class="logo-section">
      <text class="logo">⚡</text>
      <text class="app-name">体测预约平台</text>
      <text class="app-version">小程序版</text>
    </view>

    <view class="role-section">
      <text class="section-title">请选择登录身份</text>
      
      <view class="role-card" @click="goToStudentLogin">
        <view class="role-icon">👨‍🎓</view>
        <text class="role-name">学生端</text>
        <text class="role-desc">预约体测、查询成绩</text>
      </view>

      <view class="role-card" @click="goToTeacherLogin">
        <view class="role-icon">👨‍🏫</view>
        <text class="role-name">教师端</text>
        <text class="role-desc">管理预约、录入成绩</text>
      </view>

      <view class="role-card" @click="goToAdminLogin">
        <view class="role-icon">👨‍💼</view>
        <text class="role-name">管理端</text>
        <text class="role-desc">系统管理、数据统计</text>
      </view>
    </view>

    <view class="footer">
      <text class="footer-text">© 2024 体测预约平台</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const goToStudentLogin = () => {
  uni.navigateTo({
    url: '/pages/student/login'
  })
}

const goToTeacherLogin = () => {
  uni.navigateTo({
    url: '/pages/teacher/login'
  })
}

const goToAdminLogin = () => {
  uni.navigateTo({
    url: '/pages/admin/login'
  })
}
</script>

<style scoped>
.index-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  padding: 80rpx 40rpx;
}

.logo-section {
  text-align: center;
  margin-bottom: 80rpx;
}

.logo {
  font-size: 120rpx;
  display: block;
  margin-bottom: 24rpx;
}

.app-name {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 12rpx;
}

.app-version {
  display: block;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.role-section {
  flex: 1;
}

.section-title {
  display: block;
  font-size: 32rpx;
  color: white;
  text-align: center;
  margin-bottom: 48rpx;
  font-weight: bold;
}

.role-card {
  background: white;
  border-radius: 24rpx;
  padding: 48rpx;
  margin-bottom: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  transition: transform 0.3s;
}

.role-card:active {
  transform: scale(0.98);
}

.role-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
}

.role-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.role-desc {
  font-size: 24rpx;
  color: #999;
}

.footer {
  text-align: center;
  padding-top: 40rpx;
}

.footer-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
}
</style>