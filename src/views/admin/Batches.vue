<template>
  <div class="manage-container">
    <a-card title="📅 体测批次管理">
      <div class="toolbar">
        <a-button type="primary" @click="showAddModal = true">+ 新增批次</a-button>
      </div>

      <a-table :columns="columns" :data-source="batches" :pagination="{ pageSize: 10 }" bordered size="small" style="margin-top: 16px">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="record.status === 'open' ? 'green' : 'red'">{{ record.status === 'open' ? '开启' : '关闭' }}</a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'slots'">
            {{ record.totalSlots - record.remainingSlots }}/{{ record.totalSlots }}
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <a-button-group size="small">
              <a-button type="primary" @click="toggleStatus(record)">{{ record.status === 'open' ? '关闭' : '开启' }}</a-button>
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
    <a-modal v-model:open="showAddModal" :title="editingId ? '编辑批次' : '新增批次'" ok-text="保存" cancel-text="取消" @ok="handleSave" width="600px">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="批次名称" required>
          <a-input v-model:value="formData.name" placeholder="例：体测第一批" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="测试项目" required>
              <a-input v-model:value="formData.project" placeholder="例：身高体重" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="测试地点" required>
              <a-input v-model:value="formData.location" placeholder="例：体育馆A区" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="测试日期" required>
              <a-input v-model:value="formData.date" type="date" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="时间段" required>
              <a-input v-model:value="formData.timeSlot" placeholder="例：09:00-11:00" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="预约名额" required>
          <a-input-number v-model:value="formData.totalSlots" :min="1" />
        </a-form-item>
        <a-form-item label="负责教师" required>
          <a-input v-model:value="formData.teacher" placeholder="请输入教师名称" />
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
  project: '',
  location: '',
  date: '',
  timeSlot: '',
  totalSlots: 30,
  teacher: '',
})

const columns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '批次名称', dataIndex: 'name', width: 120 },
  { title: '项目', dataIndex: 'project', width: 100 },
  { title: '地点', dataIndex: 'location', width: 100 },
  { title: '日期', dataIndex: 'date', width: 100 },
  { title: '已约/总数', dataIndex: 'slots', width: 100 },
  { title: '状态', dataIndex: 'status', width: 80 },
  { title: '操作', dataIndex: 'actions', width: 200 },
]

const batches = computed(() => store.batches)

const handleEdit = (batch: any) => {
  editingId.value = batch.id
  formData.name = batch.name
  formData.project = batch.project
  formData.location = batch.location
  formData.date = batch.date
  formData.timeSlot = batch.timeSlot
  formData.totalSlots = batch.totalSlots
  formData.teacher = batch.teacher
  showAddModal.value = true
}

const handleSave = () => {
  if (!formData.name || !formData.project || !formData.location || !formData.date) {
    message.error('请填写必要信息')
    return
  }

  if (editingId.value) {
    store.updateBatch(editingId.value, {
      name: formData.name,
      project: formData.project,
      location: formData.location,
      date: formData.date,
      timeSlot: formData.timeSlot,
      totalSlots: formData.totalSlots,
      teacher: formData.teacher,
    })
    message.success('批次已更新')
  } else {
    store.addBatch({
      name: formData.name,
      project: formData.project,
      location: formData.location,
      date: formData.date,
      timeSlot: formData.timeSlot,
      totalSlots: formData.totalSlots,
      remainingSlots: formData.totalSlots,
      teacher: formData.teacher,
      status: 'open',
    })
    message.success('批次已添加')
  }

  showAddModal.value = false
  editingId.value = ''
}

const toggleStatus = (batch: any) => {
  store.toggleBatchStatus(batch.id)
  message.success(`预约已${batch.status === 'open' ? '关闭' : '开启'}`)
}

const handleDelete = (id: string) => {
  store.deleteBatch(id)
  message.success('批次已删除')
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
