<template>
  <div class="appointments-container">
    <a-card title="👥 学生预约管理" class="appointments-card">
      <!-- 批次选择器 -->
      <div class="filter-bar">
        <a-space>
          <span>选择批次:</span>
          <a-select
            v-model:value="selectedBatchId"
            style="width: 250px"
            placeholder="请选择体测批次"
            @change="onBatchChange"
          >
            <a-select-option value="">全部批次</a-select-option>
            <a-select-option v-for="batch in assignedBatches" :key="batch.id" :value="batch.id">
              {{ batch.name }} ({{ getAppointmentCount(batch.id) }}人)
            </a-select-option>
          </a-select>

          <a-button @click="handleExportExcel" :loading="exporting">
            📥 导出Excel
          </a-button>
        </a-space>
      </div>

      <!-- 预约表格 -->
      <a-table
        :columns="columns"
        :data-source="filteredAppointments"
        :loading="false"
        :pagination="{ pageSize: 10, showTotal: (total) => `共 ${total} 条预约` }"
        bordered
        size="small"
        style="margin-top: 16px"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'index'">
            {{ index + 1 }}
          </template>
          <template v-else-if="column.dataIndex === 'studentName'">
            <strong>{{ record.studentName }}</strong>
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <a-button type="text" size="small" @click="handleViewDetail(record)">
              详情
            </a-button>
          </template>
        </template>
      </a-table>

      <a-empty v-if="filteredAppointments.length === 0" description="暂无预约记录" />
    </a-card>

    <!-- 详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="预约详情"
      :footer="null"
      width="600px"
    >
      <a-descriptions v-if="selectedAppointment" :column="1" bordered size="small">
        <a-descriptions-item label="学号">
          {{ getStudent(selectedAppointment.studentId)?.studentId }}
        </a-descriptions-item>
        <a-descriptions-item label="姓名">
          {{ selectedAppointment.studentName }}
        </a-descriptions-item>
        <a-descriptions-item label="班级">
          {{ getStudent(selectedAppointment.studentId)?.class }}
        </a-descriptions-item>
        <a-descriptions-item label="联系电话">
          {{ selectedAppointment.studentPhone }}
        </a-descriptions-item>
        <a-descriptions-item label="测试项目">
          {{ selectedAppointment.project }}
        </a-descriptions-item>
        <a-descriptions-item label="测试地点">
          {{ selectedAppointment.location }}
        </a-descriptions-item>
        <a-descriptions-item label="测试日期">
          {{ selectedAppointment.date }}
        </a-descriptions-item>
        <a-descriptions-item label="测试时段">
          {{ selectedAppointment.timeSlot }}
        </a-descriptions-item>
        <a-descriptions-item label="预约时间">
          {{ formatDateTime(selectedAppointment.createdAt) }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useTeacherStore } from '@/stores/teacher'
import type { Appointment } from '@/types'

const store = useTeacherStore()

const selectedBatchId = ref('')
const detailModalVisible = ref(false)
const selectedAppointment = ref<any>(null)
const exporting = ref(false)

const assignedBatches = computed(() => store.assignedBatches)

const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60 },
  { title: '学号', dataIndex: 'studentId', key: 'studentId', width: 100 },
  { title: '姓名', dataIndex: 'studentName', key: 'studentName', width: 100 },
  { title: '班级', dataIndex: 'class', key: 'class', width: 100 },
  { title: '测试项目', dataIndex: 'project', key: 'project', width: 120 },
  { title: '预约时段', dataIndex: 'timeSlot', key: 'timeSlot', width: 120 },
  { title: '操作', dataIndex: 'actions', key: 'actions', width: 80 },
]

const filteredAppointments = computed(() => {
  if (!selectedBatchId.value) {
    return store.getAllAppointments()
  }
  return store.getAppointmentsByBatch(selectedBatchId.value)
})

const getStudent = (studentId: string) => {
  return store.getStudent(studentId)
}

const getAppointmentCount = (batchId: string) => {
  return store.getAppointmentsByBatch(batchId).length
}

const onBatchChange = () => {
  // 自动更新表格
}

const handleViewDetail = (record: any) => {
  selectedAppointment.value = record
  detailModalVisible.value = true
}

const handleExportExcel = async () => {
  if (!selectedBatchId.value) {
    message.warning('请先选择要导出的批次')
    return
  }

  exporting.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const result = store.exportToExcel(selectedBatchId.value)

    if (result.success) {
      // 模拟Excel导出（实际应用中需要使用xlsx库）
      message.success(`${result.data?.filename} 已准备好，实际使用中会下载文件`)
    } else {
      message.error(result.message)
    }
  } finally {
    exporting.value = false
  }
}

const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime)
  return date.toLocaleString('zh-CN')
}
</script>

<style scoped>
.appointments-container {
  display: flex;
  flex-direction: column;
}

.appointments-card {
  border-radius: 8px;
}

.filter-bar {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 16px;
}

:deep(.ant-table-small) {
  font-size: 13px;
}

:deep(.ant-table td) {
  padding: 8px !important;
}
</style>
