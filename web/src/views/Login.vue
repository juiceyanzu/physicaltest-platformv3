<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const role = ref<'teacher' | 'admin'>('teacher')
const message = ref('')
const messageColor = ref('#52c41a')

const handleLogin = async () => {
  if (!username.value) {
    message.value = '请输入用户名'
    messageColor.value = '#ff4d4f'
    return
  }

  if (!password.value) {
    message.value = '请输入密码'
    messageColor.value = '#ff4d4f'
    return
  }

  const result = await authStore.login(username.value, password.value)

  if (result.success) {
    message.value = result.message
    messageColor.value = '#52c41a'
    if (authStore.user?.role === 'admin') {
      router.push('/admin/dashboard')
    } else if (authStore.user?.role === 'teacher') {
      router.push('/teacher/dashboard')
    } else {
      router.push('/teacher/dashboard')
    }
  } else {
    message.value = result.message
    messageColor.value = '#ff4d4f'
  }
}

const handleRoleChange = (value: string) => {
  role.value = value as 'teacher' | 'admin'
  if (role.value === 'admin') {
    username.value = 'admin'
    password.value = 'admin123'
  } else {
    username.value = 'T2026001'
    password.value = '123456'
  }
}

username.value = 'T2026001'
password.value = '123456'
</script>

<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px;">
    <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); width: 100%; max-width: 400px;">
      <h2 style="text-align: center; margin-bottom: 8px; color: #1890ff;">体测平台管理系统</h2>
      <p style="text-align: center; color: #666; margin-bottom: 24px;">教师/管理员登录</p>

      <div style="display: flex; background: #f5f5f5; border-radius: 4px; padding: 4px; margin-bottom: 24px;">
        <button
          @click="handleRoleChange('teacher')"
          :style="{ flex: 1, padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.3s', background: role === 'teacher' ? '#fff' : 'transparent' }"
        >
          教师登录
        </button>
        <button
          @click="handleRoleChange('admin')"
          :style="{ flex: 1, padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.3s', background: role === 'admin' ? '#fff' : 'transparent' }"
        >
          管理员登录
        </button>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">用户名</label>
        <input
          v-model="username"
          :placeholder="role === 'admin' ? '请输入管理员用户名' : '请输入教师工号'"
          style="width: 100%; padding: 12px; border: 1px solid #d9d9d9; border-radius: 4px; box-sizing: border-box;"
          @keyup.enter="handleLogin"
        />
      </div>

      <div style="margin-bottom: 24px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">密码</label>
        <input
          type="password"
          v-model="password"
          placeholder="请输入密码"
          style="width: 100%; padding: 12px; border: 1px solid #d9d9d9; border-radius: 4px; box-sizing: border-box;"
          @keyup.enter="handleLogin"
        />
      </div>

      <button
        @click="handleLogin"
        style="width: 100%; padding: 12px; background: #1890ff; color: white; border: none; border-radius: 4px; font-size: 14px; cursor: pointer;"
      >
        登录
      </button>

      <div v-if="message" :style="{ marginTop: '16px', padding: '12px', background: messageColor === '#52c41a' ? '#f6ffed' : '#fff1f0', color: messageColor, borderRadius: '4px', textAlign: 'center' }">
        {{ message }}
      </div>

      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
        <p style="margin: 4px 0; font-size: 12px; color: #999; text-align: center;">教师测试账号：T2026001 / 123456</p>
        <p style="margin: 4px 0; font-size: 12px; color: #999; text-align: center;">管理员测试账号：admin / admin123</p>
      </div>
    </div>
  </div>
</template>
