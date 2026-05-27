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
        <text class="subtitle">学生登录</text>
      </view>

      <view class="form-item">
        <text class="form-label">学号</text>
        <input
          class="form-input"
          v-model="formData.studentId"
          placeholder="请输入学号"
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

      <view class="divider">
        <view class="divider-line"></view>
        <text class="divider-text">其他登录方式</text>
        <view class="divider-line"></view>
      </view>

      <view class="wechat-login-section">
        <button class="wechat-login-btn" open-type="getUserInfo" @getuserinfo="handleWechatLogin">
          <view class="wechat-icon">
            <text class="icon">💬</text>
          </view>
          <text class="wechat-text">微信一键登录</text>
        </button>
      </view>

      <view class="switch-role">
        <text class="link" @click="switchToTeacher">切换到教师端 →</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useStudentStore } from '@/stores/student'

const store = useStudentStore()
const loading = ref(false)

const formData = reactive({
  studentId: '',
  password: '',
})

const handleLogin = async () => {
  if (!formData.studentId || !formData.password) {
    uni.showToast({
      title: '请输入学号和密码',
      icon: 'none'
    })
    return
  }

  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const result = await store.login(formData.studentId, formData.password)

    if (result.success) {
      uni.showToast({
        title: result.message,
        icon: 'success'
      })
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/student/home'
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

const handleWechatLogin = async (e: any) => {
  if (e.detail.userInfo) {
    try {
      uni.showLoading({
        title: '登录中...'
      })

      const loginRes = await uni.login({
        provider: 'weixin'
      })

      if (loginRes[1].code) {
        const userInfo = e.detail.userInfo
        
        uni.setStorageSync('wechatUserInfo', userInfo)
        uni.setStorageSync('wechatCode', loginRes[1].code)
        
        const mockStudentId = `wx_${Date.now().toString().slice(-8)}`
        
        const result = await store.login(mockStudentId, 'wechat')
        
        if (result.success) {
          uni.showToast({
            title: '微信登录成功',
            icon: 'success'
          })
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/student/home'
            })
          }, 1500)
        } else {
          uni.showToast({
            title: '请先使用学号密码登录并绑定微信',
            icon: 'none'
          })
        }
      }
    } catch (error) {
      uni.showToast({
        title: '微信登录失败',
        icon: 'none'
      })
    } finally {
      uni.hideLoading()
    }
  }
}

const switchToTeacher = () => {
  uni.navigateTo({
    url: '/pages/teacher/login'
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: #667eea;
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
  color: #1890ff;
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
  background-color: #1890ff;
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

.divider {
  display: flex;
  align-items: center;
  margin: 64rpx 0;
}

.divider-line {
  flex: 1;
  height: 2rpx;
  background-color: #e8e8e8;
}

.divider-text {
  padding: 0 32rpx;
  font-size: 24rpx;
  color: #999;
}

.wechat-login-section {
  margin-top: 32rpx;
}

.wechat-login-btn {
  width: 100%;
  height: 88rpx;
  background-color: #07c160;
  color: white;
  border: none;
  border-radius: 16rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wechat-login-btn::after {
  border: none;
}

.wechat-icon {
  margin-right: 16rpx;
  font-size: 36rpx;
}

.wechat-text {
  font-size: 28rpx;
}

.switch-role {
  text-align: center;
  margin-top: 48rpx;
}

.link {
  color: #1890ff;
  font-size: 24rpx;
}
</style>