<template>
  <div class="my-appointments-container">
    <a-card title="✓ 我的预约" class="my-appointments-card">
      <!-- 状态筛选 -->
      <div class="filter-bar">
        <a-space wrap>
          <a-button
            v-for="status in appointmentStatuses"
            :key="status.value"
            :type="selectedStatus === status.value ? 'primary' : 'default'"
            @click="selectedStatus = status.value"
          >
            {{ status.label }} ({{ getStatusCount(status.value) }})
          </a-button>
        </a-space>
      </div>

      <!-- 预约列表 -->
      <a-list :data-source="filteredAppointments" :loading="false">
        <template #renderItem="{ item }">
          <a-list-item class="appointment-item">
            <a-list-item-meta>
              <template #avatar>
                <a-tag :color="getStatusColor(item.status)">{{ getStatusLabel(item.status) }}</a-tag>
              </template>
              <template #title>
                <span class="appointment-title">{{ item.batchName }} - {{ item.project }}</span>
              </template>
              <template #description>
                <div class="appointment-details">
                  <p class="detail-row">
                    <span class="detail-label">📅 日期时间:</span>
                    <span>{{ item.date }} {{ item.timeSlot }}</span>
                  </p>
                  <p class="detail-row">
                    <span class="detail-label">🏢 地点:</span>
                    <span>{{ item.location }}</span>
                  </p>
                  <p class="detail-row">
                    <span class="detail-label">📝 预约时间:</span>
                    <span>{{ formatDateTime(item.createdAt) }}</span>
                  </p>
                </div>
              </template>
            </a-list-item-meta>

            <template #actions>
              <a-button
                v-if="item.status === 'confirmed' || item.status === 'pending'"
                danger
                size="small"
                @click="handleCancel(item.id)"
              >
                取消预约
              </a-button>
            </template>
          </a-list-item>
        </template>
      </a-list>

      <a-empty v-if="filteredAppointments.length === 0" description="暂无预约记录" />
    </a-card>

    <!-- 取消确认弹窗 -->
    <a-modal
      v-model:open="cancelModalVisible"
      title="确认取消预约"
      ok-text="确认"
      cancel-text="返回"
      ok-button-props="{ danger: true }"
      @ok="confirmCancel"
      :confirmLoading="cancelLoading"
    >
      <a-alert
        type="warning"
        message="确认要取消该预约吗？"
        description="取消后，该时段名额将释放给其他同学。"
        show-icon
        style="margin-bottom: 16px"
      />
      <p v-if="appointmentToCancel">
        <strong>{{ appointmentToCancel.batchName }}</strong> - {{ appointmentToCancel.project }}
        <br />
        {{ appointmentToCancel.date }} {{ appointmentToCancel.timeSlot }}
      </p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useStudentStore } from '@/stores/student'
import type { Appointment } from '@/types'

const store = useStudentStore()
const selectedStatus = ref('')
const cancelModalVisible = ref(false)
const appointmentToCancel = ref<Appointment | null>(null)
const cancelLoading = ref(false)

const appointmentStatuses = [
  { value: '', label: '全部' },
  { value: 'pending', label: '待确认' },
  { value: 'confirmed', label: '已确认' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
]

const filteredAppointments = computed(() => {
  if (!selectedStatus.value) {
    return store.appointments
  }
  return store.appointments.filter((a) => a.status === selectedStatus.value)
})

const getStatusCount = (status: string) => {
  if (!status) {
    return store.appointments.length
  }
  return store.appointments.filter((a) => a.status === status).length
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'orange',
    confirmed: 'blue',
    completed: 'green',
    cancelled: 'default',
  }
  return colors[status] || 'default'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消',
  }
  return labels[status] || status
}

const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime)
  return date.toLocaleString('zh-CN')
}

const handleCancel = (appointmentId: string) => {
  appointmentToCancel.value = store.appointments.find((a) => a.id === appointmentId) || null
  cancelModalVisible.value = true
}

const confirmCancel = async () => {
  if (!appointmentToCancel.value) return

  cancelLoading.value = true

  try {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const result = store.cancelAppointment(appointmentToCancel.value.id)

    if (result.success) {
      message.success(result.message)
      cancelModalVisible.value = false
      appointmentToCancel.value = null
    } else {
      message.error(result.message)
    }
  } finally {
    cancelLoading.value = false
  }
}
</script>

<style scoped>
.my-appointments-container {
  padding-bottom: 80px;
}

.my-appointments-card {
  border-radius: 8px;
}

.filter-bar {
  margin-bottom: 20px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.appointment-item {
  padding: 16px 0 !important;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-list-item-action) {
  margin-left: 16px;
}

.appointment-title {
  font-weight: 500;
  font-size: 15px;
  color: #333;
}

.appointment-details {
  margin-top: 8px;
}

.detail-row {
  margin: 4px 0;
  font-size: 13px;
  color: #666;
}

.detail-label {
  font-weight: 500;
  margin-right: 8px;
  color: #333;
}

/* 响应式 */
@media (max-width: 768px) {
  :deep(.ant-list-item-action) {
    margin-left: 0;
    margin-top: 8px;
  }
}
</style>
