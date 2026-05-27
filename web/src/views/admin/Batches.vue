<script setup lang="ts">
import { ref, onMounted, h, computed } from 'vue'
import { Card, Table, Button, Modal, Input, InputNumber, message, Tag, Select } from 'ant-design-vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()
const searchKey = ref('')
const statusFilter = ref('all')
const isModalVisible = ref(false)
const editingId = ref('')

const formData = ref({
  name: '',
  startDate: '',
  endDate: '',
  maxCapacity: 50,
})

const statusColors: Record<string, string> = {
  active: 'green',
  completed: 'blue',
  draft: 'gray'
}

const statusTexts: Record<string, string> = {
  active: '进行中',
  completed: '已完成',
  draft: '草稿'
}

const columns = [
  { title: '批次名称', dataIndex: 'name', key: 'name' },
  { title: '开始日期', dataIndex: 'startDate', key: 'startDate' },
  { title: '结束日期', dataIndex: 'endDate', key: 'endDate' },
  { title: '最大容量', dataIndex: 'maxCapacity', key: 'maxCapacity' },
  { title: '当前人数', dataIndex: 'currentCount', key: 'currentCount' },
  {
    title: '状态',
    key: 'status',
    render: (_: any, record: any) => h(Tag, { color: statusColors[record.status] || 'default' }, statusTexts[record.status] || record.status)
  },
  {
    title: '进度',
    key: 'progress',
    render: (_: any, record: any) => {
      const progress = record.maxCapacity ? Math.round((record.currentCount || 0) / record.maxCapacity * 100) : 0
      return h('div', null, [
        h('div', { style: { width: '100px', height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' } }, [
          h('div', { style: { width: `${progress}%`, height: '100%', background: '#1890ff', borderRadius: '4px' } })
        ]),
        h('span', { style: { marginLeft: '8px', fontSize: '12px', color: '#666' } }, `${progress}%`)
      ])
    }
  },
  {
    title: '操作',
    key: 'action',
    render: (_: any, record: any) => h('div', null, [
      h(Button, { type: 'text', onClick: () => handleEdit(record) }, '编辑'),
      record.status !== 'completed' && h(Button, { type: 'text', onClick: () => handleComplete(record.id) }, '完成'),
      h(Button, { type: 'text', danger: true, onClick: () => handleDelete(record.id) }, '删除')
    ])
  }
]

const filteredBatches = computed(() => {
  let result = adminStore.batches
  if (searchKey.value) {
    result = result.filter(b => b.name.includes(searchKey.value))
  }
  if (statusFilter.value !== 'all') {
    result = result.filter(b => b.status === statusFilter.value)
  }
  return result
})

const showModal = () => {
  editingId.value = ''
  formData.value = {
    name: '',
    startDate: '',
    endDate: '',
    maxCapacity: 50,
  }
  isModalVisible.value = true
}

const handleEdit = (record: any) => {
  editingId.value = record.id
  formData.value = {
    name: record.name,
    startDate: record.startDate,
    endDate: record.endDate,
    maxCapacity: record.maxCapacity,
  }
  isModalVisible.value = true
}

const handleDelete = async (id: string) => {
  const result = await adminStore.deleteBatch(id)
  if (result.success) {
    message.success(result.message)
  } else {
    message.error(result.message)
  }
}

const handleComplete = async (id: string) => {
  const batch = adminStore.batches.find(b => b.id === id)
  if (batch) {
    const result = await adminStore.updateBatch(id, {
      name: batch.name,
      startDate: batch.startDate,
      endDate: batch.endDate,
      maxCapacity: batch.maxCapacity,
      status: 'completed'
    })
    if (result.success) {
      message.success('批次已完成')
    } else {
      message.error(result.message || '操作失败')
    }
  }
}

const handleOk = async () => {
  const name = formData.value.name.trim()
  const startDate = formData.value.startDate
  const endDate = formData.value.endDate

  if (!name || !startDate || !endDate) {
    message.warning('请填写完整信息')
    return
  }

  if (startDate > endDate) {
    message.warning('开始日期不能晚于结束日期')
    return
  }

  let result
  if (editingId.value) {
    result = await adminStore.updateBatch(editingId.value, {
      name,
      startDate,
      endDate,
      maxCapacity: formData.value.maxCapacity,
      status: 'active'
    })
  } else {
    result = await adminStore.createBatch({ name, startDate, endDate, maxCapacity: formData.value.maxCapacity })
  }

  if (result.success) {
    message.success(result.message)
    isModalVisible.value = false
  } else {
    message.error(result.message)
  }
}

const handleCancel = () => {
  isModalVisible.value = false
}

onMounted(async () => {
  await adminStore.loadBatches()
})
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <h2>批次管理</h2>
      <Button type="primary" @click="showModal">添加批次</Button>
    </div>

    <div style="display: flex; gap: 16px; margin-bottom: 16px;">
      <Input
        v-model:value="searchKey"
        placeholder="搜索批次名称..."
        style="width: 300px;"
      />
      <Select v-model:value="statusFilter" placeholder="状态筛选" style="width: 150px;">
        <Select.Option value="all">全部</Select.Option>
        <Select.Option value="active">进行中</Select.Option>
        <Select.Option value="completed">已完成</Select.Option>
        <Select.Option value="draft">草稿</Select.Option>
      </Select>
    </div>

    <Card>
      <Table
        :columns="columns"
        :data-source="filteredBatches"
        rowKey="id"
        :pagination="{ pageSize: 10 }"
      />
    </Card>

    <Modal
      :title="editingId ? '编辑批次' : '添加批次'"
      :open="isModalVisible"
      @ok="handleOk"
      @cancel="handleCancel"
      width="500px"
    >
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">批次名称</label>
          <Input v-model:value="formData.name" placeholder="请输入批次名称" style="width: 100%;" />
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">开始日期</label>
          <input type="date" v-model="formData.startDate" style="width: 100%; padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 14px;" />
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">结束日期</label>
          <input type="date" v-model="formData.endDate" style="width: 100%; padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 14px;" />
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">最大容量</label>
          <InputNumber v-model:value="formData.maxCapacity" :min="1" :max="9999" placeholder="请输入最大容量" style="width: 100%;" />
        </div>
      </div>
    </Modal>
  </div>
</template>
