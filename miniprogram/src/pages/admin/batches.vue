<template>
  <view class="batches-container">
    <view class="header">
      <text class="title">批次管理</text>
      <button class="back-btn" @click="navigateBack">返回</button>
    </view>

    <view class="batch-list">
      <view class="batch-card" v-for="batch in batches" :key="batch.id">
        <view class="batch-header">
          <text class="batch-name">{{ batch.name }}</text>
          <view class="batch-status" :class="'status-' + batch.status">
            {{ getStatusText(batch.status) }}
          </view>
        </view>

        <view class="batch-info">
          <text class="info-item">📅 {{ batch.date }} {{ batch.timeSlot }}</text>
          <text class="info-item">📍 {{ batch.location }}</text>
          <text class="info-item">👨‍🏫 {{ batch.teacher }}</text>
          <text class="info-item">🏃 {{ batch.project }}</text>
          <text class="info-item">🔢 容量：{{ batch.capacity }} / 剩余：{{ batch.remainingSlots }}</text>
        </view>

        <view class="batch-actions">
          <button class="action-btn edit" @click="editBatch(batch)">
            编辑
          </button>
          <button class="action-btn delete" @click="deleteBatch(batch.id)">
            删除
          </button>
        </view>
      </view>

      <view class="empty-state" v-if="batches.length === 0">
        <text class="empty-text">暂无批次记录</text>
      </view>
    </view>

    <button class="add-btn" @click="addBatch">
      + 添加批次
    </button>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import type { TestBatch } from '@/types'

const store = useAdminStore()

const batches = computed(() => store.batches)

const getStatusText = (status: string) => {
  const statusMap = {
    open: '开放',
    closed: '关闭',
    completed: '已完成'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const addBatch = () => {
  uni.showToast({
    title: '添加批次功能开发中',
    icon: 'none'
  })
}

const editBatch = (batch: TestBatch) => {
  uni.showToast({
    title: '编辑批次功能开发中',
    icon: 'none'
  })
}

const deleteBatch = (batchId: string) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该批次吗？',
    success: async (res) => {
      if (res.confirm) {
        const result = await store.deleteBatch(batchId)
        uni.showToast({
          title: result.message,
          icon: result.success ? 'success' : 'none'
        })
      }
    }
  })
}

const navigateBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.batches-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.back-btn {
  background-color: #f0f0f0;
  color: #666;
  border: none;
  border-radius: 8rpx;
  padding: 8rpx 16rpx;
  font-size: 24rpx;
}

.batch-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 100rpx;
}

.batch-card {
  background: white;
  padding: 32rpx;
  border-radius: 16rpx;
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
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
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
  background-color: #e6f7ff;
  color: #1890ff;
}

.batch-info {
  margin-bottom: 24rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-item {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
}

.batch-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  flex: 1;
  padding: 12rpx 0;
  border: none;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: bold;
}

.action-btn.edit {
  background-color: #1890ff;
  color: white;
}

.action-btn.delete {
  background-color: #ff4d4f;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 120rpx 0;
  background: white;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.add-btn {
  position: fixed;
  bottom: 32rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 88rpx;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: bold;
  box-shadow: 0 8rpx 24rpx rgba(24, 144, 255, 0.4);
}

.add-btn::after {
  border: none;
}
</style>