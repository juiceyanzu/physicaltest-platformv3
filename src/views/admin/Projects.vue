<template>
  <div class="manage-container">
    <a-card title="📋 体测项目管理">
      <div class="toolbar">
        <a-button type="primary" @click="showAddModal = true">+ 新增项目</a-button>
      </div>

      <a-table :columns="columns" :data-source="projects" :pagination="{ pageSize: 10 }" bordered size="small" style="margin-top: 16px">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="record.isActive ? 'green' : 'red'">{{ record.isActive ? '启用' : '禁用' }}</a-tag>
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
    <a-modal v-model:open="showAddModal" :title="editingId ? '编辑项目' : '新增项目'" ok-text="保存" cancel-text="取消" @ok="handleSave">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="项目名称" required>
          <a-input v-model:value="formData.name" placeholder="请输入项目名称" />
        </a-form-item>
        <a-form-item label="项目描述">
          <a-textarea v-model:value="formData.description" placeholder="请输入项目描述" />
        </a-form-item>
        <a-form-item label="及格分数" required>
          <a-input-number v-model:value="formData.passingScore" :min="0" :max="20" />
        </a-form-item>
        <a-form-item label="是否启用">
          <a-checkbox v-model:checked="formData.isActive" />
        </a-form-item>
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
  name: '',
  description: '',
  passingScore: 12,
  isActive: true,
})

const columns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '项目名称', dataIndex: 'name', width: 150 },
  { title: '描述', dataIndex: 'description', width: 200 },
  { title: '及格分数', dataIndex: 'passingScore', width: 100 },
  { title: '状态', dataIndex: 'status', width: 80 },
  { title: '操作', dataIndex: 'actions', width: 150 },
]

const projects = computed(() => store.projects)

const handleEdit = (project: any) => {
  editingId.value = project.id
  formData.name = project.name
  formData.description = project.description
  formData.passingScore = project.passingScore
  formData.isActive = project.isActive
  showAddModal.value = true
}

const handleSave = () => {
  if (!formData.name) {
    message.error('请输入项目名称')
    return
  }

  if (editingId.value) {
    store.updateProject(editingId.value, {
      name: formData.name,
      description: formData.description,
      passingScore: formData.passingScore,
      isActive: formData.isActive,
    })
    message.success('项目已更新')
  } else {
    store.addProject({
      name: formData.name,
      description: formData.description,
      scoringStandard: { A: [18, 20], B: [15, 17], C: [12, 14], D: [0, 11] },
      passingScore: formData.passingScore,
      isActive: formData.isActive,
    })
    message.success('项目已添加')
  }

  showAddModal.value = false
  editingId.value = ''
  formData.name = ''
  formData.description = ''
  formData.passingScore = 12
  formData.isActive = true
}

const handleDelete = (id: string) => {
  store.deleteProject(id)
  message.success('项目已删除')
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
</style>
