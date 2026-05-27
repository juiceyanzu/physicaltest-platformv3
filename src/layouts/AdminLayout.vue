<template>
  <a-layout class="admin-layout">
    <!-- 顶部导航 -->
    <a-layout-header class="layout-header">
      <div class="header-content">
        <div class="logo">⚡ 体测管理平台 (管理端)</div>
        <div class="header-right">
          <a-button v-if="currentAdmin" type="text" class="user-info">
            {{ currentAdmin.name }} ({{ currentAdmin.role }})
          </a-button>
          <a-divider type="vertical" />
          <a-button v-if="currentAdmin" danger type="text" @click="handleLogout">
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
          <span v-if="!collapsed" class="logo-text">管理系统</span>
        </div>

        <a-menu :selectedKeys="[activeMenu]" @click="handleMenuClick">
          <a-menu-item key="dashboard">
            <template #icon><span>📊</span></template>
            <span>工作首页</span>
          </a-menu-item>
          <a-menu-item key="users">
            <template #icon><span>👥</span></template>
            <span>用户管理</span>
          </a-menu-item>
          <a-menu-item key="projects">
            <template #icon><span>📋</span></template>
            <span>项目管理</span>
          </a-menu-item>
          <a-menu-item key="batches">
            <template #icon><span>📅</span></template>
            <span>批次管理</span>
          </a-menu-item>
          <a-menu-item key="notices">
            <template #icon><span>📢</span></template>
            <span>公告管理</span>
          </a-menu-item>
          <a-menu-item key="banners">
            <template #icon><span>🖼️</span></template>
            <span>轮播图管理</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <!-- 主内容 -->
      <a-layout-content class="layout-content">
        <div class="breadcrumb-area">
          <a-breadcrumb>
            <a-breadcrumb-item>
              <router-link to="/admin/dashboard">首页</router-link>
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
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const route = useRoute()
const store = useAdminStore()
const collapsed = ref(false)

const currentAdmin = computed(() => store.currentAdmin)

const activeMenu = computed(() => {
  const path = route.path.split('/')[2]
  return path || 'dashboard'
})

const getBreadcrumbTitle = () => {
  const titles: Record<string, string> = {
    dashboard: '工作首页',
    users: '用户管理',
    projects: '项目管理',
    batches: '批次管理',
    notices: '公告管理',
    banners: '轮播图管理',
  }
  return titles[activeMenu.value] || '页面'
}

const handleMenuClick = (e: any) => {
  const paths: Record<string, string> = {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    projects: '/admin/projects',
    batches: '/admin/batches',
    notices: '/admin/notices',
    banners: '/admin/banners',
  }
  router.push(paths[e.key])
}

const handleLogout = () => {
  store.logout()
  message.success('已退出登录')
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout-header {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
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
  background: #1f2937 !important;
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
  background: #f3f4f6;
  overflow: auto;
}

.breadcrumb-area {
  margin-bottom: 20px;
  padding: 12px 16px;
  background: white;
  border-radius: 4px;
}

:deep(.ant-breadcrumb-link) {
  color: #7c3aed;
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
