<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <a-row :gutter="[16, 16]" class="stats-row">
      <a-col :xs="12" :sm="6" :lg="4">
        <a-statistic-card title="系统用户" :value="adminStats.totalUsers">
          <template #prefix>👥</template>
        </a-statistic-card>
      </a-col>
      <a-col :xs="12" :sm="6" :lg="4">
        <a-statistic-card title="学生用户" :value="adminStats.totalStudents">
          <template #prefix>🎓</template>
        </a-statistic-card>
      </a-col>
      <a-col :xs="12" :sm="6" :lg="4">
        <a-statistic-card title="教师用户" :value="adminStats.totalTeachers">
          <template #prefix>👨‍🏫</template>
        </a-statistic-card>
      </a-col>
      <a-col :xs="12" :sm="6" :lg="4">
        <a-statistic-card title="活跃批次" :value="adminStats.activeBatches">
          <template #prefix>📋</template>
        </a-statistic-card>
      </a-col>
      <a-col :xs="12" :sm="6" :lg="4">
        <a-statistic-card title="总体测批次" :value="adminStats.totalBatches">
          <template #prefix>📅</template>
        </a-statistic-card>
      </a-col>
      <a-col :xs="12" :sm="6" :lg="4">
        <a-statistic-card title="发布公告数" :value="adminStats.totalNotices">
          <template #prefix>📢</template>
        </a-statistic-card>
      </a-col>
    </a-row>

    <!-- 快速操作 -->
    <a-card title="🚀 快速操作" class="quick-actions" style="margin-top: 24px">
      <a-space wrap>
        <a-button type="primary" @click="goTo('/admin/users')">
          👥 管理用户
        </a-button>
        <a-button @click="goTo('/admin/projects')">
          📋 管理项目
        </a-button>
        <a-button @click="goTo('/admin/batches')">
          📅 管理批次
        </a-button>
        <a-button @click="goTo('/admin/notices')">
          📢 管理公告
        </a-button>
        <a-button @click="goTo('/admin/banners')">
          🖼️ 管理轮播图
        </a-button>
        <a-button danger @click="handleLogout">
          🚪 退出登录
        </a-button>
      </a-space>
    </a-card>

    <!-- 系统信息 -->
    <a-card title="ℹ️ 系统信息" style="margin-top: 24px">
      <a-descriptions :column="{ xxl: 4, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }">
        <a-descriptions-item label="当前管理员">
          {{ currentAdmin?.name }} ({{ currentAdmin?.role }})
        </a-descriptions-item>
        <a-descriptions-item label="平台版本">
          v1.0.0
        </a-descriptions-item>
        <a-descriptions-item label="上次登录">
          {{ currentAdmin?.lastLogin ? formatDate(currentAdmin.lastLogin) : '首次登录' }}
        </a-descriptions-item>
        <a-descriptions-item label="系统状态">
          <a-tag color="green">正常运行</a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const store = useAdminStore()

const currentAdmin = computed(() => store.currentAdmin)
const adminStats = computed(() => store.adminStats)

const goTo = (path: string) => {
  router.push(path)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

const handleLogout = () => {
  store.logout()
  message.success('已退出登录')
  router.push('/admin/login')
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
}

.stats-row {
  margin-bottom: 20px;
}

:deep(.ant-statistic-card) {
  border-radius: 8px;
}

.quick-actions {
  border-radius: 8px;
}

:deep(.ant-space) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
