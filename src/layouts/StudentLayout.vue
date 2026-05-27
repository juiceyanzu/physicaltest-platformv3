<template>
  <a-layout class="student-layout">
    <!-- 顶部导航 -->
    <a-layout-header class="layout-header">
      <div class="header-content">
        <div class="logo">⚡ 体测预约</div>
        <div class="header-right">
          <a-button v-if="currentUser" type="text" class="user-info">
            {{ currentUser.name }}
          </a-button>
          <a-button v-if="currentUser" danger type="text" @click="handleLogout">
            退出
          </a-button>
        </div>
      </div>
    </a-layout-header>

    <!-- 主内容 -->
    <a-layout-content class="layout-content">
      <RouterView />
    </a-layout-content>

    <!-- 底部导航 -->
    <div v-if="currentUser && !isLoginPage" class="bottom-nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="['nav-item', { active: isActive(item.path) }]"
      >
        <div class="nav-icon">{{ item.icon }}</div>
        <div class="nav-label">{{ item.label }}</div>
      </router-link>
    </div>
  </a-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
import { message } from 'ant-design-vue'
import { useStudentStore } from '@/stores/student'

const router = useRouter()
const route = useRoute()
const store = useStudentStore()

const currentUser = computed(() => store.currentUser)

const navItems = [
  { path: '/student/home', label: '首页', icon: '🏠' },
  { path: '/student/notices', label: '公告', icon: '📢' },
  { path: '/student/appointments', label: '预约', icon: '📅' },
  { path: '/student/my-appointments', label: '我的预约', icon: '✓' },
  { path: '/student/scores', label: '成绩', icon: '📊' },
  { path: '/student/profile', label: '我的', icon: '👤' },
]

const isLoginPage = computed(() => route.name === 'StudentLogin')

const isActive = (path: string) => {
  return route.path.startsWith(path.split('/')[2])
}

const handleLogout = () => {
  store.logout()
  message.success('已退出登录')
  router.push('/student/login')
}
</script>

<style scoped>
.student-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout-header {
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  color: white;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 999;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  height: 64px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: white;
  letter-spacing: 1px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  color: white !important;
}

.user-info:hover {
  color: rgba(255, 255, 255, 0.8) !important;
}

.layout-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 24px 16px;
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: white;
  border-top: 1px solid #f0f0f0;
  padding: 8px 0;
  position: sticky;
  bottom: 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-item:hover,
.nav-item.active {
  color: #1890ff;
}

.nav-icon {
  font-size: 20px;
}

.nav-label {
  font-size: 12px;
}

/* 响应式 */
@media (max-width: 768px) {
  .layout-content {
    padding: 12px 8px;
  }

  .logo {
    font-size: 16px;
  }

  .header-right {
    gap: 8px;
  }
}
</style>
