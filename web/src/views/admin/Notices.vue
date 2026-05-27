<script setup lang="ts">
import { ref, onMounted, h, computed } from 'vue'
import { Card, Table, Button, Modal, Input, message, Tag, Select } from 'ant-design-vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()
const isModalVisible = ref(false)
const editingId = ref('')
const searchKey = ref('')
const statusFilter = ref('all')

const formData = ref({
  title: '',
  content: '',
  priority: 'normal'
})

const columns = [
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
  {
    title: '操作',
    key: 'action',
    render: (_: any, record: any) => h('div', null, [
      h(Button, { type: 'text', onClick: () => handleEdit(record) }, '编辑'),
      h(Button, { type: 'text', danger: true, onClick: () => handleDelete(record.id) }, '删除'),
      record.status === 'draft' && h(Button, { type: 'text', onClick: () => handlePublish(record.id) }, '发布'),
      record.status === 'published' && h(Button, { type: 'text', onClick: () => handleArchive(record.id) }, '归档')
    ])
  }
]

const filteredNotices = computed(() => {
  let result = adminStore.notices
  if (searchKey.value) {
    result = result.filter(n => n.title.includes(searchKey.value))
  }
  if (statusFilter.value !== 'all') {
    result = result.filter(n => n.status === statusFilter.value)
  }
  return result
})

const showModal = () => {
  editingId.value = ''
  formData.value = {
    title: '',
    content: '',
    priority: 'normal'
  }
  isModalVisible.value = true
}

const handleEdit = (record: any) => {
  editingId.value = record.id
  formData.value = {
    title: record.title,
    content: record.content,
    priority: record.priority
  }
  isModalVisible.value = true
}

const handleDelete = async (id: string) => {
  const result = await adminStore.deleteNotice(id)
  if (result.success) {
    message.success(result.message)
  } else {
    message.error(result.message)
  }
}

const handlePublish = async (id: string) => {
  const notice = adminStore.notices.find(n => n.id === id)
  if (notice) {
    const result = await adminStore.updateNotice(id, {
      title: notice.title,
      content: notice.content,
      priority: notice.priority,
      status: 'published'
    })
    if (result.success) {
      message.success('公告已发布')
    } else {
      message.error(result.message || '操作失败')
    }
  }
}

const handleArchive = async (id: string) => {
  const notice = adminStore.notices.find(n => n.id === id)
  if (notice) {
    const result = await adminStore.updateNotice(id, {
      title: notice.title,
      content: notice.content,
      priority: notice.priority,
      status: 'archived'
    })
    if (result.success) {
      message.success('公告已归档')
    } else {
      message.error(result.message || '操作失败')
    }
  }
}

const handleOk = async () => {
  const title = formData.value.title.trim()
  const content = formData.value.content.trim()

  if (!title || !content) {
    message.warning('请填写标题和内容')
    return
  }

  let result
  if (editingId.value) {
    result = await adminStore.updateNotice(editingId.value, { title, content, priority: formData.value.priority })
  } else {
    result = await adminStore.createNotice({ title, content, priority: formData.value.priority })
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
  await adminStore.loadNotices()
})
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <h2>公告管理</h2>
      <Button type="primary" @click="showModal">发布公告</Button>
    </div>

    <div style="display: flex; gap: 16px; margin-bottom: 16px;">
      <Input
        v-model:value="searchKey"
        placeholder="搜索公告标题..."
        style="width: 300px;"
      />
      <Select v-model:value="statusFilter" placeholder="状态筛选" style="width: 150px;">
        <Select.Option value="all">全部</Select.Option>
        <Select.Option value="published">已发布</Select.Option>
        <Select.Option value="draft">草稿</Select.Option>
        <Select.Option value="archived">已归档</Select.Option>
      </Select>
    </div>

    <Card>
      <Table
        :columns="columns"
        :data-source="filteredNotices"
        rowKey="id"
        :pagination="{ pageSize: 10 }"
      />
    </Card>

    <Modal
      :title="editingId ? '编辑公告' : '发布公告'"
      :open="isModalVisible"
      @ok="handleOk"
      @cancel="handleCancel"
      width="600px"
    >
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">标题</label>
          <Input v-model:value="formData.title" placeholder="请输入公告标题" style="width: 100%;" />
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">优先级</label>
          <Select v-model:value="formData.priority" style="width: 100%;">
            <Select.Option value="high">高</Select.Option>
            <Select.Option value="normal">中</Select.Option>
            <Select.Option value="low">低</Select.Option>
          </Select>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">内容</label>
          <Input.TextArea v-model:value="formData.content" placeholder="请输入公告内容" :rows="6" style="width: 100%;" />
        </div>
      </div>
    </Modal>
  </div>
</template>
