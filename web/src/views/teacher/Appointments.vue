<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { Card, Table, Button, Select, Tag, message, Spin } from 'ant-design-vue'
import { useTeacherStore } from '@/stores/teacher'

const teacherStore = useTeacherStore()
const loading = ref(true)

const selectedBatch = ref('')
const selectedStatus = ref('')

const filteredAppointments = computed(() => {
  return teacherStore.appointments.filter((appointment: any) => {
    if (selectedBatch.value && (appointment.batchId || appointment.batch_id) !== selectedBatch.value) return false
    if (selectedStatus.value && appointment.status !== selectedStatus.value) return false
    return true
  })
})

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
  {
    title: '操作',
    key: 'action',
    render: (_: any, record: any) => h('div', null, [
      record.status === 'pending' && h(Button, { type: 'text', onClick: () => handleMarkCompleted(record.id) }, '标记完成')
    ])
  }
]

const handleMarkCompleted = async (id: string) => {
  const result = await teacherStore.updateAppointment(id, { status: 'completed' })
  if (result.success) {
    message.success('标记完成成功')
  } else {
    message.error(result.message || '操作失败')
  }
}

onMounted(async () => {
  loading.value = true
  await Promise.all([
    teacherStore.loadAppointments(),
    teacherStore.loadBatches(),
  ])
  loading.value = false
})
</script>

<template>
  <div style="padding: 24px;">
    <h2 style="margin-bottom: 24px;">预约管理</h2>

    <Card style="margin-bottom: 24px;">
      <div style="display: flex; gap: 24px;">
        <div>
          <label style="margin-right: 8px;">批次筛选：</label>
          <Select
            v-model:value="selectedBatch"
            style="width: 200px;"
            placeholder="全部批次"
            allowClear
          >
            <Select.Option
              v-for="batch in teacherStore.batches"
              :key="batch.id"
              :value="batch.id"
            >
              {{ batch.name }}
            </Select.Option>
          </Select>
        </div>
        <div>
          <label style="margin-right: 8px;">状态筛选：</label>
          <Select
            v-model:value="selectedStatus"
            style="width: 150px;"
            placeholder="全部状态"
            allowClear
          >
            <Select.Option value="pending">待处理</Select.Option>
            <Select.Option value="completed">已完成</Select.Option>
            <Select.Option value="canceled">已取消</Select.Option>
          </Select>
        </div>
      </div>
    </Card>

    <Card title="预约列表">
      <Spin :spinning="loading">
        <Table
          :data-source="filteredAppointments"
          :columns="columns"
          :pagination="false"
          :rowKey="(record: any) => record.id"
          size="middle"
        />
      </Spin>
    </Card>
  </div>
</template>
