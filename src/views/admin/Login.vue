<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1 class="title">⚡ 体测管理平台</h1>
        <p class="subtitle">管理员登录</p>
      </div>

      <a-form :model="formData" layout="vertical" @finish="handleLogin">
        <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
          <a-input v-model:value="formData.username" placeholder="请输入用户名" size="large" />
        </a-form-item>

        <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password v-model:value="formData.password" placeholder="请输入密码" size="large" />
        </a-form-item>

        <a-form-item>
          <a-button
            html-type="submit"
            type="primary"
            size="large"
            block
            :loading="loading"
            class="login-btn"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </a-button>
        </a-form-item>
      </a-form>

      <WechatLogin role="admin" :on-success="handleWechatLogin" />

      <div class="switch-role">
        <router-link to="/student/login" class="link">切换到学生端 →</router-link>
        <span class="divider">|</span>
        <router-link to="/teacher/login" class="link">切换到教师端 →</router-link>
      </div>
    </div>

    <div class="login-bg">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAdminStore } from '@/stores/admin'
import { mockAdmins } from '@/utils/mockData'
import WechatLogin from '@/components/WechatLogin.vue'
import { logWechatLogin } from '@/utils/wechatLogin'

const router = useRouter()
const store = useAdminStore()
const loading = ref(false)

const formData = reactive({
  username: '',
  password: '',
})

const demoAdmins = mockAdmins

const handleLogin = async () => {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const result = await store.login(formData.username, formData.password)

    if (result.success) {
      message.success(result.message)
      router.push('/admin/dashboard')
    } else {
      message.error(result.message)
    }
  } finally {
    loading.value = false
  }
}

const handleWechatLogin = async (userInfo: any) => {
  logWechatLogin('wechat_login_success', { userInfo, role: 'admin' })
  
  const mockUsername = `wx_${userInfo.openid.slice(-8)}`
  
  const result = await store.login(mockUsername, 'wechat')
  
  if (result.success) {
    message.success('微信登录成功')
    router.push('/admin/dashboard')
  } else {
    message.info('请先使用用户名密码登录并绑定微信')
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  position: relative;
  overflow: hidden;
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
  width: 300px;
  height: 300px;
  background: white;
  top: -100px;
  right: -50px;
}

.shape-2 {
  width: 200px;
  height: 200px;
  background: white;
  bottom: -50px;
  left: -50px;
}

.shape-3 {
  width: 150px;
  height: 150px;
  background: white;
  top: 50%;
  right: 10%;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  z-index: 10;
  position: relative;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #7c3aed;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.login-btn {
  height: 40px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
}

.demo-hint {
  margin-top: 24px;
}

:deep(.ant-divider) {
  margin: 16px 0 12px 0;
}

.demo-accounts {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  margin-top: 12px;
}

.demo-account {
  margin: 6px 0;
  font-size: 13px;
  color: #333;
}

.login-info {
  margin-top: 16px;
}

:deep(.ant-alert) {
  border-radius: 4px;
}

.switch-role {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  font-size: 14px;
}

.link {
  color: #7c3aed;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.divider {
  margin: 0 8px;
  color: #ddd;
}

/* 响应式 */
@media (max-width: 768px) {
  .login-box {
    max-width: 100%;
    margin: 0 16px;
    padding: 32px 20px;
  }

  .title {
    font-size: 24px;
  }

  .shape-1,
  .shape-2,
  .shape-3 {
    display: none;
  }
}
</style>
