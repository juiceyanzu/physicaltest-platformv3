<template>
  <div class="manage-container">
    <a-card title="📢 体测公告管理">
      <div class="toolbar">
        <a-button type="primary" @click="showAddModal = true">+ 发布公告</a-button>
      </div>

      <a-table :columns="columns" :data-source="notices" :pagination="{ pageSize: 10 }" bordered size="small" style="margin-top: 16px">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
          <template v-else-if="column.dataIndex === 'type'">
            <a-tag :color="getTypeColor(record.type)">{{ getTypeLabel(record.type) }}</a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'priority'">
            <a-tag :color="record.priority === 'high' ? 'red' : 'default'">{{ record.priority === 'high' ? '重要' : '普通' }}</a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <a-button-group size="small">
              <a-button @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm title="确认删除？" ok-text="确认" cancel-text="取消" @confirm="handleDelete(record.id)">
                <a-button danger>删除</a-button>
              </a-popconfirm>
            </a-button-group>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑弹窗 -->
    <a-modal v-model:open="showAddModal" :title="editingId ? '编辑公告' : '发布公告'" ok-text="保存" cancel-text="取消" @ok="handleSave" width="700px">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="公告标题" required>
          <a-input v-model:value="formData.title" placeholder="请输入公告标题" />
        </a-form-item>
        <a-form-item label="公告内容" required>
          <a-textarea v-model:value="formData.content" :rows="6" placeholder="请输入公告内容" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="公告类型" required>
              <a-select v-model:value="formData.type">
                <a-select-option value="schedule">时间安排</a-select-option>
                <a-select-option value="makeup">补测通知</a-select-option>
                <a-select-option value="result">成绩公示</a-select-option>
                <a-select-option value="notice">一般通知</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="优先级" required>
              <a-select v-model:value="formData.priority">
                <a-select-option value="high">重要</a-select-option>
                <a-select-option value="normal">普通</a-select-option>
                <a-select-option value="low">低</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { useAdminStore } from '@/stores/admin'

const store = useAdminStore()

const showAddModal = ref(false)
const editingId = ref('')

const formData = reactive({
  title: '',
  content: '',
  type: 'notice',
  priority: 'normal',
})

const columns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '标题', dataIndex: 'title', width: 200 },
  { title: '类型', dataIndex: 'type', width: 100 },
  { title: '优先级', dataIndex: 'priority', width: 100 },
  { title: '发布时间', dataIndex: 'publishDate', width: 120 },
  { title: '操作', dataIndex: 'actions', width: 150 },
]

const notices = computed(() => store.notices)

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = { schedule: 'blue', makeup: 'orange', result: 'green', notice: 'cyan' }
  return colors[type] || 'default'
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = { schedule: '时间安排', makeup: '补测通知', result: '成绩公示', notice: '一般通知' }
  return labels[type] || type
}

const handleEdit = (notice: any) => {
  editingId.value = notice.id
  formData.title = notice.title
  formData.content = notice.content
  formData.type = notice.type
  formData.priority = notice.priority
  showAddModal.value = true
}

const handleSave = () => {
  if (!formData.title || !formData.content) {
    message.error('请填写必要信息')
    return
  }

  if (editingId.value) {
    store.updateNotice(editingId.value, {
      title: formData.title,
      content: formData.content,
      type: formData.type as any,
      priority: formData.priority as any,
    })
    message.success('公告已更新')
  } else {
    store.addNotice({
      title: formData.title,
      content: formData.content,
      type: formData.type as any,
      priority: formData.priority as any,
      publishDate: new Date().toISOString().split('T')[0],
      tags: [],
    })
    message.success('公告已发布')
  }

  showAddModal.value = false
  editingId.value = ''
}

const handleDelete = (id: string) => {
  store.deleteNotice(id)
  message.success('公告已删除')
}
</script>

<style scoped>
.manage-container {
  display: flex;
  flex-direction: column;
}

.toolbar {
  margin-bottom: 16px;
}

:deep(.ant-button-group) {
  display: flex;
  gap: 4px;
}
</style>
