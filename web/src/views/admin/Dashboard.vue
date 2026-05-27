<script setup lang="ts">
import { computed, onMounted, h, ref } from 'vue'
import { Card, Table, Tag, Spin } from 'ant-design-vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()
const loading = ref(true)

const quickStats = computed(() => [
  { title: '学生总数', value: adminStore.students.length, unit: '人', color: '#1890ff', bgColor: '#e6f7ff' },
  { title: '教师人数', value: adminStore.teachers.length, unit: '人', color: '#52c41a', bgColor: '#f6ffed' },
  { title: '体测批次', value: adminStore.batches.length, unit: '个', color: '#faad14', bgColor: '#fffbe6' },
  { title: '测试项目', value: adminStore.projects.length, unit: '项', color: '#ff4d4f', bgColor: '#fff1f0' },
])

const recentStudents = computed(() => adminStore.students.slice(0, 5))
const recentBatches = computed(() => adminStore.batches.slice(0, 5))
const recentNotices = computed(() => adminStore.notices.slice(0, 5))

const studentColumns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '班级', dataIndex: 'class', key: 'class' },
  { title: '专业', dataIndex: 'major', key: 'major' },
  { title: '年级', dataIndex: 'grade', key: 'grade' },
]

const batchColumns = [
  { title: '批次名称', dataIndex: 'name', key: 'name' },
  { title: '开始日期', dataIndex: 'startDate', key: 'startDate' },
  { title: '结束日期', dataIndex: 'endDate', key: 'endDate' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (s: string) => {
      const colors: Record<string, string> = { active: 'success', completed: 'info', draft: 'default' }
      const texts: Record<string, string> = { active: '进行中', completed: '已完成', draft: '草稿' }
      return h(Tag, { color: colors[s] || 'default' }, texts[s] || s)
    }
  },
  {
    title: '进度',
    dataIndex: 'currentCount',
    key: 'currentCount',
    render: (c: number, r: any) => `${c}/${r.maxCapacity}人`
  },
]

const noticeColumns = [
  { title: '标题', dataIndex: 'title', key: 'title' },
  {
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority',
    render: (p: string) => {
      const colors: Record<string, string> = { high: 'error', normal: 'warning', low: 'success' }
      const texts: Record<string, string> = { high: '高', normal: '中', low: '低' }
      return h(Tag, { color: colors[p] || 'default' }, texts[p] || p)
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (s: string) => {
      const colors: Record<string, string> = { published: 'success', draft: 'default', archived: 'info' }
      const texts: Record<string, string> = { published: '已发布', draft: '草稿', archived: '已归档' }
      return h(Tag, { color: colors[s] || 'default' }, texts[s] || s)
    }
  },
  {
    title: '发布时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (d: string) => d ? new Date(d).toLocaleString() : '-'
  },
]

onMounted(async () => {
  loading.value = true
  await Promise.all([
    adminStore.loadStudents(),
    adminStore.loadTeachers(),
    adminStore.loadBatches(),
    adminStore.loadProjects(),
    adminStore.loadNotices(),
  ])
  loading.value = false
})
</script>

<template>
  <div style="padding: 24px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <h2 style="font-size: 20px; font-weight: 600;">管理中心</h2>
      <div style="color: #999; font-size: 14px;">欢迎回来，管理员</div>
    </div>

    <Spin :spinning="loading">
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div
          v-for="stat in quickStats"
          :key="stat.title"
          :style="{ background: stat.bgColor, padding: '20px', borderRadius: '8px' }"
        >
          <div style="font-size: 13px; color: #666; margin-bottom: 8px;">{{ stat.title }}</div>
          <div :style="{ fontSize: '24px', fontWeight: 'bold', color: stat.color }">{{ stat.value }}</div>
          <div style="font-size: 12px; color: #999;">{{ stat.unit }}</div>
        </div>
      </div>

      <div style="display: flex; gap: 24px;">
        <div style="flex: 1;">
          <Card title="最近学生" :bordered="false" style="margin-bottom: 24px;">
            <Table
              :columns="studentColumns"
              :data-source="recentStudents"
              :pagination="false"
              rowKey="id"
              size="small"
            />
          </Card>

          <Card title="最近批次" :bordered="false">
            <Table
              :columns="batchColumns"
              :data-source="recentBatches"
              :pagination="false"
              rowKey="id"
              size="small"
            />
          </Card>
        </div>

        <div style="flex: 1;">
          <Card title="系统公告" :bordered="false">
            <Table
              :columns="noticeColumns"
              :data-source="recentNotices"
              :pagination="false"
              rowKey="id"
              size="small"
            />
          </Card>
        </div>
      </div>
    </Spin>
  </div>
</template>
