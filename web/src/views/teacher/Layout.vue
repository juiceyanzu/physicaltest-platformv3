<script setup lang="ts">
import { h } from 'vue'
import { Layout, Menu, Button } from 'ant-design-vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { DashboardOutlined, CalendarOutlined, FileTextOutlined, LogoutOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const menuItems = [
  { key: '/teacher/dashboard', label: '仪表板', icon: DashboardOutlined },
  { key: '/teacher/appointments', label: '预约管理', icon: CalendarOutlined },
  { key: '/teacher/scores', label: '成绩录入', icon: FileTextOutlined }
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
        体测平台 - 教师端
      </div>
      <div style="float: right;">
        <span style="color: #fff; margin-right: 20px;">欢迎, {{ authStore.profile?.name }}</span>
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