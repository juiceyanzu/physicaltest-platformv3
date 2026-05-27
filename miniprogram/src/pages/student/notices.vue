<template>
  <view class="notices-container">
    <view class="notice-list">
      <view class="notice-card" v-for="notice in notices" :key="notice.id" @click="goToDetail(notice.id)">
        <view class="notice-header">
          <text class="notice-title">{{ notice.title }}</text>
          <view class="notice-tag" :class="'tag-' + notice.priority">
            {{ notice.priority === 'high' ? '重要' : notice.priority === 'normal' ? '普通' : '低' }}
          </view>
        </view>

        <view class="notice-content">
          <text class="notice-preview">{{ getPreview(notice.content) }}</text>
        </view>

        <view class="notice-footer">
          <text class="notice-author">👤 {{ notice.author }}</text>
          <text class="notice-date">📅 {{ notice.publishDate }}</text>
        </view>
      </view>

      <view class="empty-state" v-if="notices.length === 0">
        <text class="empty-text">暂无公告</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useStudentStore } from '@/stores/student'

const store = useStudentStore()

onShow(() => {
  store.loadNotices()
})

const notices = computed(() => store.notices)

const getPreview = (content: string) => {
  return content.length > 100 ? content.substring(0, 100) + '...' : content
}

const goToDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/student/notice-detail?id=${id}`
  })
}
</script>

<style scoped>
.notices-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.notice-card {
  background: white;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.notice-title {
  flex: 1;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-right: 16rpx;
  line-height: 1.4;
}

.notice-tag {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
  font-weight: bold;
  white-space: nowrap;
}

.tag-high {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.tag-normal {
  background-color: #e6f7ff;
  color: #1890ff;
}

.tag-low {
  background-color: #f6ffed;
  color: #52c41a;
}

.notice-content {
  margin-bottom: 20rpx;
}

.notice-preview {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.notice-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.notice-author,
.notice-date {
  font-size: 24rpx;
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