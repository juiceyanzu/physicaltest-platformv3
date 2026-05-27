<template>
  <view class="appointments-container">
    <view class="search-section">
      <input
        class="search-input"
        v-model="searchKeyword"
        placeholder="搜索批次、项目、地点"
        placeholder-class="input-placeholder"
        @confirm="handleSearch"
      />
      <button class="search-btn" @click="handleSearch">搜索</button>
    </view>

    <view class="filter-section">
      <picker mode="date" :value="filterDate" @change="onDateChange">
        <view class="filter-item">
          <text class="filter-label">日期：</text>
          <text class="filter-value">{{ filterDate || '全部' }}</text>
        </view>
      </picker>
      <picker mode="selector" :range="locations" @change="onLocationChange">
        <view class="filter-item">
          <text class="filter-label">地点：</text>
          <text class="filter-value">{{ selectedLocation || '全部' }}</text>
        </view>
      </picker>
    </view>

    <view class="batch-list">
      <view class="batch-card" v-for="batch in filteredBatches" :key="batch.id">
        <view class="batch-header">
          <text class="batch-name">{{ batch.name }}</text>
          <view class="batch-status" :class="'status-' + batch.status">
            {{ batch.status === 'open' ? '开放中' : batch.status === 'closed' ? '已关闭' : '已完成' }}
          </view>
        </view>

        <view class="batch-info">
          <text class="info-item">📅 {{ batch.date }} {{ batch.timeSlot }}</text>
          <text class="info-item">📍 {{ batch.location }}</text>
          <text class="info-item">👨‍🏫 {{ batch.teacher }}</text>
          <text class="info-item">🏃 {{ batch.project }}</text>
        </view>

        <view class="batch-footer">
          <view class="capacity-info">
            <text class="capacity-text">剩余名额：</text>
            <text class="capacity-value" :class="batch.remainingSlots <= 5 ? 'warning' : ''">
              {{ batch.remainingSlots }} / {{ batch.capacity }}
            </text>
          </view>
          <button
            class="appoint-btn"
            :disabled="batch.status !== 'open' || batch.remainingSlots <= 0"
            @click="handleAppoint(batch.id)"
          >
            {{ batch.status !== 'open' ? '已关闭' : batch.remainingSlots <= 0 ? '已满员' : '立即预约' }}
          </button>
        </view>
      </view>

      <view class="empty-state" v-if="filteredBatches.length === 0">
        <text class="empty-text">暂无符合条件的批次</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useStudentStore } from '@/stores/student'
import { getToken } from '@/api'

const store = useStudentStore()

onShow(async () => {
  if (!store.state.user && getToken()) {
    await store.getProfile()
  }
  store.loadBatches()
})

const searchKeyword = ref('')
const filterDate = ref('')
const selectedLocation = ref('')

const locations = computed(() => {
  const locs = new Set(store.batches.map(b => b.location))
  return ['全部', ...Array.from(locs)]
})

const filteredBatches = computed(() => {
  let batches = store.availableBatches

  if (searchKeyword.value) {
    batches = store.searchBatches(searchKeyword.value)
  }

  if (filterDate.value) {
    batches = store.filterBatches({ date: filterDate.value })
  }

  if (selectedLocation.value && selectedLocation.value !== '全部') {
    batches = store.filterBatches({ location: selectedLocation.value })
  }

  return batches
})

const handleSearch = () => {
  console.log('搜索:', searchKeyword.value)
}

const onDateChange = (e: any) => {
  filterDate.value = e.detail.value
}

const onLocationChange = (e: any) => {
  selectedLocation.value = locations.value[e.detail.value]
}

const handleAppoint = async (batchId: string) => {
  uni.showModal({
    title: '确认预约',
    content: '确定要预约这个批次吗？',
    success: async (res) => {
      if (res.confirm) {
        const result = await store.appointBatch(batchId)
        if (result.success) {
          uni.showToast({
            title: result.message,
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: result.message,
            icon: 'none'
          })
        }
      }
    }
  })
}
</script>

<style scoped>
.appointments-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.search-section {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.search-input {
  flex: 1;
  height: 72rpx;
  background: white;
  border-radius: 36rpx;
  padding: 0 32rpx;
  font-size: 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.input-placeholder {
  color: #ccc;
}

.search-btn {
  width: 140rpx;
  height: 72rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 36rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn::after {
  border: none;
}

.filter-section {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.filter-item {
  flex: 1;
  background: white;
  padding: 20rpx 24rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.filter-label {
  font-size: 28rpx;
  color: #666;
  margin-right: 8rpx;
}

.filter-value {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.batch-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.batch-card {
  background: white;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.batch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.batch-name {
  flex: 1;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-right: 16rpx;
}

.batch-status {
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: bold;
}

.status-open {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-closed {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.status-completed {
  background-color: #f0f0f0;
  color: #999;
}

.batch-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 24rpx;
}

.info-item {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.batch-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.capacity-info {
  display: flex;
  align-items: center;
}

.capacity-text {
  font-size: 28rpx;
  color: #666;
}

.capacity-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #52c41a;
}

.capacity-value.warning {
  color: #ff4d4f;
}

.appoint-btn {
  width: 200rpx;
  height: 64rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 32rpx;
  font-size: 28rpx;
  font-weight: bold;
}

.appoint-btn::after {
  border: none;
}

.appoint-btn[disabled] {
  background: #ccc;
  color: #999;
}

.empty-state {
  text-align: center;
  padding: 120rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>