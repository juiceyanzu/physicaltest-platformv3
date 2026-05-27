<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { Card, Table, Tag, Spin } from 'ant-design-vue'
import { useTeacherStore } from '@/stores/teacher'

const teacherStore = useTeacherStore()
const loading = ref(true)

const stats = computed(() => ({
  totalBatches: teacherStore.batches.length,
  totalAppointments: teacherStore.appointments.length,
  completedAppointments: teacherStore.appointments.filter((a: any) => a.status === 'completed').length,
  pendingAppointments: teacherStore.appointments.filter((a: any) => a.status === 'pending').length,
}))

const recentAppointments = computed(() =>
  teacherStore.appointments.slice(0, 5).map((a: any) => ({
    id: a.id,
    studentName: a.studentName,
    batchName: a.batchName,
    status: a.status,
    createdAt: a.createdAt || a.created_at,
  }))
)

const quickStats = computed(() => [
  { title: '管理批次', value: stats.value.totalBatches, unit: '个', color: '#1890ff', bgColor: '#e6f7ff' },
  { title: '预约总数', value: stats.value.totalAppointments, unit: '条', color: '#52c41a', bgColor: '#f6ffed' },
  { title: '已完成', value: stats.value.completedAppointments, unit: '条', color: '#faad14', bgColor: '#fffbe6' },
  { title: '待处理', value: stats.value.pendingAppointments, unit: '条', color: '#ff4d4f', bgColor: '#fff1f0' },
])

const columns = [
  { title: '学生姓名', dataIndex: 'studentName', key: 'studentName' },
  { title: '批次', dataIndex: 'batchName', key: 'batchName' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (s: string) => {
      const colors: Record<string, string> = { pending: 'warning', completed: 'success', canceled: 'error' }
      const texts: Record<string, string> = { pending: '待处理', completed: '已完成', canceled: '已取消' }
      return h(Tag, { color: colors[s] || 'default' }, texts[s] || s)
    }
  },
  {
    title: '预约时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (d: string) => d ? new Date(d).toLocaleString() : '-'
  },
]

onMounted(async () => {
  loading.value = true
  await Promise.all([
    teacherStore.loadBatches(),
    teacherStore.loadAppointments(),
    teacherStore.loadScores(),
  ])
  loading.value = false
})
</script>

<template>
  <div style="padding: 24px;">
    <h2 style="margin-bottom: 24px;">教师仪表板</h2>

    <Spin :spinning="loading">
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div
          v-for="stat in quickStats"
          :key="stat.title"
          :style="{ background: stat.bgColor, padding: '20px', borderRadius: '8px' }"
        >
          <div style="font-size: 14px; color: #666; margin-bottom: 8px;">{{ stat.title }}</div>
          <div :style="{ fontSize: '24px', fontWeight: 'bold', color: stat.color }">{{ stat.value }}</div>
          <div style="font-size: 12px; color: #999;">{{ stat.unit }}</div>
        </div>
      </div>

      <Card title="最近预约记录" style="margin-bottom: 24px;">
        <Table
          :data-source="recentAppointments"
          :columns="columns"
          :pagination="false"
          :rowKey="(record: any) => record.id"
          size="small"
        />
      </Card>
    </Spin>
  </div>
</template>
