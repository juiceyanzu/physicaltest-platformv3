<script setup lang="ts">
import { h } from 'vue'
import { Layout, Menu, Button } from 'ant-design-vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { DashboardOutlined, UserOutlined, CalendarOutlined, SettingOutlined, FileTextOutlined, LogoutOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const menuItems = [
  { key: '/admin/dashboard', label: '管理中心', icon: DashboardOutlined },
  { key: '/admin/users', label: '用户管理', icon: UserOutlined },
  { key: '/admin/batches', label: '批次管理', icon: CalendarOutlined },
  { key: '/admin/projects', label: '项目管理', icon: SettingOutlined },
  { key: '/admin/notices', label: '公告管理', icon: FileTextOutlined }
]

const handleLogout = () => {
  authStore.logout()
}

const handleMenuClick = (key: string) => {
  router.push(key)
}
</script>

<template>
  <Layout style="min-height: 100vh;">
    <Layout.Header style="background: #001529;">
      <div class="logo" style="color: #fff; font-size: 18px; font-weight: bold;">
        体测平台 - 管理端
      </div>
      <div style="float: right;">
        <span style="color: #fff; margin-right: 20px;">欢迎, {{ authStore.profile?.name || '管理员' }}</span>
        <Button type="text" :icon="h(LogoutOutlined)" @click="handleLogout" style="color: #fff;">
          退出登录
        </Button>
      </div>
    </Layout.Header>
    
    <Layout.Sider width="200" style="background: #001529;">
      <Menu 
        mode="inline" 
        theme="dark"
        :selectedKeys="[route.path]"
        @click="(e: any) => handleMenuClick(e.key)"
      >
        <Menu.Item 
          v-for="item in menuItems" 
          :key="item.key"
          :icon="h(item.icon)"
        >
          {{ item.label }}
        </Menu.Item>
      </Menu>
    </Layout.Sider>
    
    <Layout.Content style="padding: 24px; background: #f0f2f5;">
      <router-view />
    </Layout.Content>
  </Layout>
</template>