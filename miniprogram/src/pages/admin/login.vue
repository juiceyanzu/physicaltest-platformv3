<template>
  <view class="login-container">
    <view class="login-bg">
      <view class="shape shape-1"></view>
      <view class="shape shape-2"></view>
      <view class="shape shape-3"></view>
    </view>

    <view class="login-box">
      <view class="login-header">
        <text class="title">⚡ 体测预约平台</text>
        <text class="subtitle">管理员登录</text>
      </view>

      <view class="form-item">
        <text class="form-label">用户名</text>
        <input
          class="form-input"
          v-model="formData.username"
          placeholder="请输入用户名"
          placeholder-class="input-placeholder"
        />
      </view>

      <view class="form-item">
        <text class="form-label">密码</text>
        <input
          class="form-input"
          v-model="formData.password"
          password
          placeholder="请输入密码"
          placeholder-class="input-placeholder"
        />
      </view>

      <button
        class="login-btn"
        :loading="loading"
        @click="handleLogin"
      >
        {{ loading ? '登录中...' : '登 录' }}
      </button>

      <view class="switch-role">
        <text class="link" @click="switchToStudent">← 切换到学生端</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAdminStore } from '@/stores/admin'

const store = useAdminStore()
const loading = ref(false)

const formData = reactive({
  username: '',
  password: '',
})

const handleLogin = async () => {
  if (!formData.username || !formData.password) {
    uni.showToast({
      title: '请输入用户名和密码',
      icon: 'none'
    })
    return
  }

  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const result = await store.login(formData.username, formData.password)

    if (result.success) {
      uni.showToast({
        title: result.message,
        icon: 'success'
      })
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/admin/dashboard'
        })
      }, 1500)
    } else {
      uni.showToast({
        title: result.message,
        icon: 'none'
      })
    }
  } finally {
    loading.value = false
  }
}

const switchToStudent = () => {
  uni.navigateTo({
    url: '/pages/student/login'
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 40rpx;
}

.login-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.shape {
  position: absolute;
  opacity: 0.1;
  border-radius: 50%;
}

.shape-1 {
  width: 600rpx;
  height: 600rpx;
  background: white;
  top: -200rpx;
  right: -100rpx;
}

.shape-2 {
  width: 400rpx;
  height: 400rpx;
  background: white;
  bottom: -100rpx;
  left: -100rpx;
}

.shape-3 {
  width: 300rpx;
  height: 300rpx;
  background: white;
  top: 50%;
  right: 10%;
}

.login-box {
  background: white;
  padding: 80rpx;
  border-radius: 24rpx;
  box-shadow: 0 20rpx 80rpx rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 800rpx;
  z-index: 10;
  position: relative;
}

.login-header {
  text-align: center;
  margin-bottom: 64rpx;
}

.title {
  font-size: 56rpx;
  font-weight: bold;
  color: #00f2fe;
  display: block;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
  display: block;
}

.form-item {
  margin-bottom: 48rpx;
}

.form-label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: block;
}

.form-input {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #d9d9d9;
  border-radius: 16rpx;
  padding: 0 32rpx;
  font-size: 28rpx;
  background-color: white;
  box-sizing: border-box;
}

.input-placeholder {
  color: #ccc;
}

.login-btn {
  width: 100%;
  height: 88rpx;
  background-color: #00f2fe;
  color: white;
  border: none;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: bold;
  letter-spacing: 4rpx;
  margin-top: 32rpx;
}

.login-btn::after {
  border: none;
}

.switch-role {
  text-align: center;
  margin-top: 48rpx;
}

.link {
  color: #00f2fe;
  font-size: 24rpx;
}
</style>