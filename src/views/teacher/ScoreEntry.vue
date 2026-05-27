<template>
  <div class="score-entry-container">
    <a-card title="📝 成绩录入" class="score-entry-card">
      <!-- 批次选择和操作 -->
      <div class="toolbar">
        <a-space>
          <span>选择批次:</span>
          <a-select
            v-model:value="selectedBatchId"
            style="width: 250px"
            placeholder="请选择体测批次"
            @change="onBatchChange"
          >
            <a-select-option value="">请选择批次</a-select-option>
            <a-select-option v-for="batch in assignedBatches" :key="batch.id" :value="batch.id">
              {{ batch.name }}
            </a-select-option>
          </a-select>
        </a-space>
      </div>

      <!-- 批次信息 -->
      <a-alert
        v-if="selectedBatch"
        type="info"
        :message="`批次: ${selectedBatch.name}`"
        :description="`项目: ${selectedBatch.project} | 地点: ${selectedBatch.location} | 日期: ${selectedBatch.date}`"
        show-icon
        style="margin: 16px 0"
      />

      <!-- 成绩表格 -->
      <div v-if="selectedBatchId" class="score-table-wrapper">
        <a-table
          :columns="scoreColumns"
          :data-source="scoreTableData"
          :pagination="{ pageSize: 10, showTotal: (total) => `共 ${total} 名学生` }"
          bordered
          size="small"
          style="margin-bottom: 20px"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex === 'index'">
              {{ index + 1 }}
            </template>
            <template v-else-if="column.key && column.key.startsWith('score_')">
              <a-input-number
                :value="getScoreItem(record, column.key)"
                :min="0"
                :max="20"
                size="small"
                @change="(v: any) => updateScore(record.id, column.key, v)"
              />
            </template>
            <template v-else-if="column.dataIndex === 'totalScore'">
              <strong>{{ calculateTotal(record) }}</strong>
            </template>
            <template v-else-if="column.dataIndex === 'status'">
              <a-tag :color="getStatusColor(record.status)">{{ formatStatus(record.status) }}</a-tag>
            </template>
            <template v-else-if="column.dataIndex === 'actions'">
              <a-button-group size="small">
                <a-button
                  v-if="record.status !== 'submitted'"
                  type="primary"
                  @click="handleSaveEntry(record)"
                >
                  保存
                </a-button>
                <a-button
                  v-if="record.status !== 'submitted' && isAllScoresEntered(record)"
                  type="primary"
                  danger
                  @click="handleSubmitEntry(record)"
                >
                  提交
                </a-button>
              </a-button-group>
            </template>
          </template>
        </a-table>

        <!-- 批量操作 -->
        <div class="batch-actions">
          <a-space>
            <a-button @click="handleSaveAll">
              💾 全部保存
            </a-button>
            <a-button type="primary" danger @click="handleSubmitAll" :disabled="!hasAnyToSubmit">
              ✓ 批量提交
            </a-button>
          </a-space>
        </div>
      </div>

      <a-empty v-else description="请先选择体测批次" />
    </a-card>

    <!-- 评分标准 -->
    <a-card title="📋 评分标准参考" style="margin-top: 20px">
      <a-table :columns="gradeColumns" :data-source="gradingStandard" :pagination="false" size="small">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'grade'">
            <a-tag :color="getStatusColor(record.grade)">{{ record.grade }}</a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useTeacherStore } from '@/stores/teacher'
import type { ScoreEntry } from '@/types'

const store = useTeacherStore()

const selectedBatchId = ref('')
const scoreEntries = ref<ScoreEntry[]>([])

const assignedBatches = computed(() => store.assignedBatches)

const selectedBatch = computed(() => store.batches.find((b) => b.id === selectedBatchId.value))

const scoreColumns = [
  { title: '序号', dataIndex: 'index', width: 50 },
  { title: '学号', dataIndex: 'studentId', key: 'studentId', width: 90 },
  { title: '姓名', dataIndex: 'studentName', key: 'studentName', width: 90 },
  { title: '身高体重', key: 'score_0', width: 80 },
  { title: '肺活量', key: 'score_1', width: 80 },
  { title: '50米跑', key: 'score_2', width: 80 },
  { title: '坐位体前屈', key: 'score_3', width: 100 },
  { title: '1000米跑', key: 'score_4', width: 90 },
  { title: '引体向上', key: 'score_5', width: 90 },
  { title: '总分', dataIndex: 'totalScore', key: 'totalScore', width: 70 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '操作', dataIndex: 'actions', key: 'actions', width: 120 },
]

const gradeColumns = [
  { title: '等级', dataIndex: 'grade', width: 80 },
  { title: '分数范围', dataIndex: 'scoreRange', width: 100 },
  { title: '说明', dataIndex: 'description', width: 150 },
]

const gradingStandard = [
  { grade: 'A', scoreRange: '18-20分', description: '优秀' },
  { grade: 'B', scoreRange: '15-17分', description: '良好' },
  { grade: 'C', scoreRange: '12-14分', description: '及格' },
  { grade: 'D', scoreRange: '0-11分', description: '不及格' },
]

const scoreTableData = computed(() => {
  if (!selectedBatchId.value) return []

  // 获取该批次所有参加体测的学生
  const appointments = store.getAppointmentsByBatch(selectedBatchId.value)

  return appointments.map((appt) => {
    // 为每个学生创建或获取成绩记录
    const entry = store.getOrCreateScoreEntry(selectedBatchId.value, appt.studentId)
    return {
      ...entry,
      key: entry?.id,
    }
  })
})

const hasAnyToSubmit = computed(() => {
  return scoreTableData.value.some((item) => item.status !== 'submitted')
})

const onBatchChange = () => {
  scoreEntries.value = []
}

const getScoreItem = (record: any, key: string) => {
  const index = parseInt(key.split('_')[1])
  return record.items[index]?.score || null
}

const updateScore = (entryId: string, key: string, value: number) => {
  const index = parseInt(key.split('_')[1])
  const entry = scoreEntries.value.find((s) => s.id === entryId)

  if (entry) {
    entry.items[index].score = value
  }
}

const calculateTotal = (record: any) => {
  return record.items.reduce((sum: number, item: any) => sum + (item.score || 0), 0)
}

const isAllScoresEntered = (record: any) => {
  return record.items.every((item: any) => item.score !== null && item.score !== undefined)
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    draft: 'orange',
    submitted: 'green',
    A: 'green',
    B: 'blue',
    C: 'orange',
    D: 'red',
  }
  return colors[status] || 'default'
}

const formatStatus = (status: string) => {
  const labels: Record<string, string> = {
    draft: '草稿',
    submitted: '已提交',
    rejected: '已驳回',
  }
  return labels[status] || status
}

const handleSaveEntry = async (record: any) => {
  const result = store.saveScoreEntry(record)
  if (result.success) {
    message.success('成绩已保存')
  } else {
    message.error(result.message)
  }
}

const handleSubmitEntry = async (record: any) => {
  const result = store.submitScoreEntry(record)
  if (result.success) {
    message.success('成绩已提交待审核')
  } else {
    message.error(result.message)
  }
}

const handleSaveAll = async () => {
  let count = 0
  for (const entry of scoreTableData.value) {
    if (entry.status !== 'submitted') {
      const result = store.saveScoreEntry(entry)
      if (result.success) count++
    }
  }
  message.success(`已保存 ${count} 条成绩`)
}

const handleSubmitAll = async () => {
  let count = 0
  for (const entry of scoreTableData.value) {
    if (entry.status !== 'submitted' && isAllScoresEntered(entry)) {
      const result = store.submitScoreEntry(entry)
      if (result.success) count++
    }
  }
  message.success(`已提交 ${count} 条成绩待审核`)
}
</script>

<style scoped>
.score-entry-container {
  display: flex;
  flex-direction: column;
}

.score-entry-card {
  border-radius: 8px;
}

.toolbar {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 16px;
}

.score-table-wrapper {
  margin-top: 16px;
}

.batch-actions {
  text-align: center;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 4px;
}

:deep(.ant-table-small) {
  font-size: 12px;
}

:deep(.ant-input-number-sm) {
  width: 100%;
}

:deep(.ant-button-group) {
  display: flex;
  gap: 4px;
}
</style>
