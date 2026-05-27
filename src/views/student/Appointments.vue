<template>
  <div class="appointments-container">
    <a-card title="📅 预约体测" class="appointments-card">
      <!-- 搜索和筛选 -->
      <div class="search-bar">
        <a-input-search
          v-model:value="searchKeyword"
          placeholder="搜索项目或地点..."
          @search="performSearch"
          style="width: 100%; margin-bottom: 16px"
        />

        <div class="filters">
          <a-space wrap>
            <a-select
              v-model:value="filters.date"
              placeholder="选择日期"
              style="width: 150px"
              @change="applyFilters"
            >
              <a-select-option value="">全部日期</a-select-option>
              <a-select-option v-for="date in availableDates" :key="date" :value="date">
                {{ formatDate(date) }}
              </a-select-option>
            </a-select>

            <a-select
              v-model:value="filters.location"
              placeholder="选择地点"
              style="width: 150px"
              @change="applyFilters"
            >
              <a-select-option value="">全部地点</a-select-option>
              <a-select-option v-for="location in availableLocations" :key="location" :value="location">
                {{ location }}
              </a-select-option>
            </a-select>

            <a-select
              v-model:value="filters.project"
              placeholder="选择项目"
              style="width: 150px"
              @change="applyFilters"
            >
              <a-select-option value="">全部项目</a-select-option>
              <a-select-option v-for="project in availableProjects" :key="project" :value="project">
                {{ project }}
              </a-select-option>
            </a-select>

            <a-button @click="resetFilters">重置筛选</a-button>
          </a-space>
        </div>
      </div>

      <!-- 可预约批次列表 -->
      <div class="batches-list">
        <a-empty v-if="displayedBatches.length === 0" description="没有找到合适的体测批次" />

        <a-row :gutter="[16, 16]" v-else>
          <a-col
            v-for="batch in displayedBatches"
            :key="batch.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
          >
            <div class="batch-card">
              <div class="batch-status" :class="getBatchStatusClass(batch)">
                {{ getBatchStatusLabel(batch) }}
              </div>

              <div class="batch-content">
                <h3 class="batch-name">{{ batch.name }}</h3>
                <p class="batch-project">
                  <strong>📍 项目:</strong> {{ batch.project }}
                </p>
                <p class="batch-info">
                  <strong>🏢 地点:</strong> {{ batch.location }}
                </p>
                <p class="batch-info">
                  <strong>🕐 时间:</strong> {{ batch.date }} {{ batch.timeSlot }}
                </p>
                <p class="batch-teacher">
                  <strong>👨‍🏫 负责老师:</strong> {{ batch.teacher }}
                </p>

                <div class="batch-slots">
                  <span>剩余名额: </span>
                  <span class="slot-number" :class="{ 'low-slots': batch.remainingSlots < 5 }">
                    {{ batch.remainingSlots }}/{{ batch.totalSlots }}
                  </span>
                </div>

                <a-progress
                  :percent="((batch.totalSlots - batch.remainingSlots) / batch.totalSlots) * 100"
                  :stroke-color="getProgressColor(batch.remainingSlots)"
                  :show-info="false"
                />
              </div>

              <div class="batch-action">
                <a-button
                  v-if="batch.status === 'open' && batch.remainingSlots > 0"
                  type="primary"
                  block
                  @click="handleAppoint(batch)"
                  :loading="appointingBatchId === batch.id"
                >
                  预约
                </a-button>
                <a-button v-else disabled block>
                  {{ batch.status === 'closed' ? '已关闭' : '已满' }}
                </a-button>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-card>

    <!-- 预约确认弹窗 -->
    <a-modal
      v-model:open="appointmentModalVisible"
      title="确认预约"
      ok-text="确认预约"
      cancel-text="取消"
      @ok="confirmAppointment"
      :confirmLoading="appointmentLoading"
    >
      <div v-if="selectedBatch" class="appointment-confirm">
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="批次名称">
            {{ selectedBatch.name }}
          </a-descriptions-item>
          <a-descriptions-item label="项目">
            {{ selectedBatch.project }}
          </a-descriptions-item>
          <a-descriptions-item label="日期">
            {{ selectedBatch.date }}
          </a-descriptions-item>
          <a-descriptions-item label="时间">
            {{ selectedBatch.timeSlot }}
          </a-descriptions-item>
          <a-descriptions-item label="地点">
            {{ selectedBatch.location }}
          </a-descriptions-item>
          <a-descriptions-item label="负责老师">
            {{ selectedBatch.teacher }}
          </a-descriptions-item>
        </a-descriptions>

        <a-alert
          type="info"
          message="预约须知"
          description="确认预约后，系统将为您保留该时段名额。请按时参加体测，如需取消可在我的预约页面操作。"
          show-icon
          style="margin-top: 16px"
        />
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useStudentStore } from '@/stores/student'
import type { TestBatch } from '@/types'

const store = useStudentStore()
const searchKeyword = ref('')
const selectedBatch = ref<TestBatch | null>(null)
const appointmentModalVisible = ref(false)
const appointingBatchId = ref('')
const appointmentLoading = ref(false)

const filters = ref({
  date: '',
  location: '',
  project: '',
})

const availableDates = computed(() => [
  ...new Set(store.batches.filter((b) => b.status === 'open').map((b) => b.date)),
].sort())

const availableLocations = computed(() => [
  ...new Set(store.batches.filter((b) => b.status === 'open').map((b) => b.location)),
].sort())

const availableProjects = computed(() => [
  ...new Set(store.batches.filter((b) => b.status === 'open').map((b) => b.project)),
].sort())

const displayedBatches = computed(() => {
  let result = store.batches.filter((b) => b.status === 'open')

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(
      (b) =>
        b.name.toLowerCase().includes(keyword) ||
        b.project.toLowerCase().includes(keyword) ||
        b.location.toLowerCase().includes(keyword) ||
        b.teacher.toLowerCase().includes(keyword),
    )
  }

  if (filters.value.date) {
    result = result.filter((b) => b.date === filters.value.date)
  }

  if (filters.value.location) {
    result = result.filter((b) => b.location === filters.value.location)
  }

  if (filters.value.project) {
    result = result.filter((b) => b.project === filters.value.project)
  }

  return result
})

const performSearch = () => {
  // 搜索逻辑已在computed中实现
}

const applyFilters = () => {
  // 筛选逻辑已在computed中实现
}

const resetFilters = () => {
  searchKeyword.value = ''
  filters.value = {
    date: '',
    location: '',
    project: '',
  }
}

const getBatchStatusClass = (batch: TestBatch) => {
  if (batch.remainingSlots === 0) return 'full'
  if (batch.remainingSlots < 5) return 'low'
  return 'normal'
}

const getBatchStatusLabel = (batch: TestBatch) => {
  if (batch.remainingSlots === 0) return '已满'
  if (batch.remainingSlots < 5) return '即将满满'
  return '还有名额'
}

const getProgressColor = (slots: number) => {
  if (slots === 0) return '#FF4D4F'
  if (slots < 5) return '#FAAD14'
  return '#52C41A'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const handleAppoint = (batch: TestBatch) => {
  selectedBatch.value = batch
  appointmentModalVisible.value = true
}

const confirmAppointment = async () => {
  if (!selectedBatch.value) return

  appointingBatchId.value = selectedBatch.value.id
  appointmentLoading.value = true

  try {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const result = store.appointBatch(selectedBatch.value.id)

    if (result.success) {
      message.success(result.message)
      appointmentModalVisible.value = false
      selectedBatch.value = null
    } else {
      message.error(result.message)
    }
  } finally {
    appointmentLoading.value = false
    appointingBatchId.value = ''
  }
}
</script>

<style scoped>
.appointments-container {
  padding-bottom: 80px;
}

.appointments-card {
  border-radius: 8px;
}

.search-bar {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 4px;
}

.filters {
  margin-top: 12px;
}

.batches-list {
  margin-top: 20px;
}

.batch-card {
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.batch-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
}

.batch-status {
  padding: 4px 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background: #52C41A;
}

.batch-status.low {
  background: #FAAD14;
}

.batch-status.full {
  background: #FF4D4F;
}

.batch-content {
  padding: 16px;
  flex: 1;
}

.batch-name {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #333;
  font-weight: bold;
}

.batch-project {
  margin: 6px 0;
  font-size: 13px;
}

.batch-info {
  margin: 6px 0;
  font-size: 13px;
  color: #666;
}

.batch-teacher {
  margin: 6px 0 12px 0;
  font-size: 13px;
  color: #666;
}

.batch-slots {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  margin: 8px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.slot-number {
  font-weight: bold;
  color: #1890ff;
}

.slot-number.low-slots {
  color: #FAAD14;
}

:deep(.ant-progress-inner) {
  background: #f0f0f0;
}

.batch-action {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
}

.appointment-confirm {
  padding: 16px 0;
}

:deep(.ant-descriptions-item-label) {
  font-weight: bold;
}

/* 响应式 */
@media (max-width: 768px) {
  .batch-card {
    border: none;
    border-bottom: 1px solid #f0f0f0;
    border-radius: 0;
  }

  .batch-card:hover {
    border-color: #d9d9d9;
    box-shadow: none;
  }
}
</style>
