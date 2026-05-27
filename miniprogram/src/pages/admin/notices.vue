<template>
  <view class="notices-container">
    <view class="header">
      <text class="title">公告管理</text>
      <button class="back-btn" @click="navigateBack">返回</button>
    </view>

    <view class="notice-list">
      <view class="notice-card" v-for="notice in notices" :key="notice.id">
        <view class="notice-header">
          <text class="notice-title">{{ notice.title }}</text>
          <view class="notice-priority" :class="'priority-' + notice.priority">
            {{ getPriorityText(notice.priority) }}
          </view>
        </view>

        <text class="notice-content">{{ truncateContent(notice.content) }}</text>
        <text class="notice-date">{{ notice.publishDate }}</text>
        <text class="notice-author">发布者：{{ notice.author }}</text>

        <view class="notice-actions">
          <button class="action-btn edit" @click="editNotice(notice)">
            编辑
          </button>
          <button class="action-btn delete" @click="deleteNotice(notice.id)">
            删除
          </button>
        </view>
      </view>

      <view class="empty-state" v-if="notices.length === 0">
        <text class="empty-text">暂无公告记录</text>
      </view>
    </view>

    <button class="add-btn" @click="addNotice">
      + 添加公告
    </button>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import type { TestNotice } from '@/types'

const store = useAdminStore()

const notices = computed(() => store.notices)

const getPriorityText = (priority: string) => {
  const priorityMap = {
    high: '高',
    normal: '中',
    low: '低'
  }
  return priorityMap[priority as keyof typeof priorityMap] || priority
}

const truncateContent = (content: string) => {
  if (content.length > 100) {
    return content.substring(0, 100) + '...'
  }
  return content
}

const addNotice = () => {
  uni.showToast({
    title: '添加公告功能开发中',
    icon: 'none'
  })
}

const editNotice = (notice: TestNotice) => {
  uni.showToast({
    title: '编辑公告功能开发中',
    icon: 'none'
  })
}

const deleteNotice = (noticeId: string) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该公告吗？',
    success: async (res) => {
      if (res.confirm) {
        const result = await store.deleteNotice(noticeId)
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
.notices-container {
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

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 100rpx;
}

.notice-card {
  background: white;
  padding: 32rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.notice-title {
  flex: 1;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-right: 16rpx;
}

.notice-priority {
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
  font-weight: bold;
}

.priority-high {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.priority-normal {
  background-color: #e6f7ff;
  color: #1890ff;
}

.priority-low {
  background-color: #f6ffed;
  color: #52c41a;
}

.notice-content {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 16rpx;
  line-height: 1.5;
  display: block;
}

.notice-date {
  font-size: 20rpx;
  color: #999;
  margin-bottom: 4rpx;
  display: block;
}

.notice-author {
  font-size: 20rpx;
  color: #999;
  margin-bottom: 24rpx;
  display: block;
}

.notice-actions {
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