<template>
  <a-layout class="teacher-layout">
    <!-- 顶部导航 -->
    <a-layout-header class="layout-header">
      <div class="header-content">
        <div class="logo">⚡ 体测管理平台 (教师端)</div>
        <div class="header-right">
          <a-button v-if="currentTeacher" type="text" class="user-info">
            {{ currentTeacher.name }} ({{ currentTeacher.workId }})
          </a-button>
          <a-divider type="vertical" />
          <a-button v-if="currentTeacher" danger type="text" @click="handleLogout">
            退出
          </a-button>
        </div>
      </div>
    </a-layout-header>

    <!-- 主布局 -->
    <a-layout class="layout-body">
      <!-- 侧边栏 -->
      <a-layout-sider class="layout-sider" :collapsed="collapsed" @collapse="collapsed = !collapsed">
        <div class="logo-section">
          <span v-if="!collapsed" class="logo-text">教师平台</span>
        </div>

        <a-menu :selectedKeys="[activeMenu]" @click="handleMenuClick">
          <a-menu-item key="dashboard">
            <template #icon>
              <span>📊</span>
            </template>
            <span>工作首页</span>
          </a-menu-item>
          <a-menu-item key="appointments">
            <template #icon>
              <span>👥</span>
            </template>
            <span>预约管理</span>
          </a-menu-item>
          <a-menu-item key="score-entry">
            <template #icon>
              <span>📝</span>
            </template>
            <span>成绩录入</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <!-- 主内容 -->
      <a-layout-content class="layout-content">
        <div class="breadcrumb-area">
          <a-breadcrumb>
            <a-breadcrumb-item>
              <router-link to="/teacher/dashboard">首页</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>{{ getBreadcrumbTitle() }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <RouterView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
import { message } from 'ant-design-vue'
import { useTeacherStore } from '@/stores/teacher'

const router = useRouter()
const route = useRoute()
const store = useTeacherStore()
const collapsed = ref(false)

const currentTeacher = computed(() => store.currentTeacher)

const activeMenu = computed(() => {
  const path = route.path.split('/')[2]
  return path || 'dashboard'
})

const getBreadcrumbTitle = () => {
  const titles: Record<string, string> = {
    dashboard: '工作首页',
    appointments: '预约管理',
    'score-entry': '成绩录入',
  }
  return titles[activeMenu.value] || '页面'
}

const handleMenuClick = (e: any) => {
  const paths: Record<string, string> = {
    dashboard: '/teacher/dashboard',
    appointments: '/teacher/appointments',
    'score-entry': '/teacher/score-entry',
  }
  router.push(paths[e.key])
}

const handleLogout = () => {
  store.logout()
  message.success('已退出登录')
  router.push('/teacher/login')
}
</script>

<style scoped>
.teacher-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout-header {
  background: linear-gradient(135deg, #ff7a45 0%, #ff5722 100%);
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
  max-width: 1400px;
  margin: 0 auto;
  height: 64px;
}

.logo {
  font-size: 18px;
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

:deep(.ant-divider-vertical) {
  background-color: rgba(255, 255, 255, 0.3);
}

.layout-body {
  flex: 1;
  display: flex;
}

.layout-sider {
  background: #001529 !important;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.logo-section {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-text {
  color: white;
  font-weight: bold;
  font-size: 14px;
}

:deep(.ant-menu) {
  background: transparent !important;
  border-right: none !important;
}

:deep(.ant-menu-item) {
  margin: 4px 0 !important;
}

.layout-content {
  flex: 1;
  padding: 24px;
  background: #f5f7fa;
  overflow: auto;
}

.breadcrumb-area {
  margin-bottom: 20px;
  padding: 12px 16px;
  background: white;
  border-radius: 4px;
}

:deep(.ant-breadcrumb-link) {
  color: #1890ff;
}

/* 响应式 */
@media (max-width: 768px) {
  .logo {
    font-size: 14px;
  }

  .layout-content {
    padding: 12px;
  }

  .header-right {
    gap: 8px;
  }
}
</style>
