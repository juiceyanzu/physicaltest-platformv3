<template>
  <view class="notice-detail-container">
    <view class="notice-card" v-if="notice">
      <view class="notice-header">
        <text class="notice-title">{{ notice.title }}</text>
        <view class="notice-tag" :class="'tag-' + notice.priority">
          {{ notice.priority === 'high' ? '重要' : notice.priority === 'normal' ? '普通' : '低' }}
        </view>
      </view>

      <view class="notice-meta">
        <text class="meta-item">👤 {{ notice.author }}</text>
        <text class="meta-item">📅 {{ notice.publishDate }}</text>
      </view>

      <view class="notice-content">
        <text class="content-text">{{ notice.content }}</text>
      </view>

      <view class="notice-attachments" v-if="notice.attachments && notice.attachments.length > 0">
        <text class="attachments-title">附件：</text>
        <view class="attachment-list">
          <view class="attachment-item" v-for="(file, index) in notice.attachments" :key="index">
            <text class="file-name">{{ file }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="empty-state" v-else>
      <text class="empty-text">公告不存在</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useStudentStore } from '@/stores/student'

const store = useStudentStore()
const noticeId = ref('')

const notice = computed(() => {
  return store.notices.find(n => n.id === noticeId.value)
})

onLoad((options: any) => {
  if (options.id) {
    noticeId.value = options.id
  }
})
</script>

<style scoped>
.notice-detail-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.notice-card {
  background: white;
  border-radius: 16rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32rpx;
}

.notice-title {
  flex: 1;
  font-size: 36rpx;
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

.notice-meta {
  display: flex;
  gap: 32rpx;
  margin-bottom: 32rpx;
  padding-bottom: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.meta-item {
  font-size: 24rpx;
  color: #999;
}

.notice-content {
  margin-bottom: 32rpx;
}

.content-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
}

.notice-attachments {
  margin-top: 32rpx;
  padding-top: 32rpx;
  border-top: 1rpx solid #f0f0f0;
}

.attachments-title {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.attachment-item {
  background-color: #f5f5f5;
  padding: 20rpx 24rpx;
  border-radius: 8rpx;
}

.file-name {
  font-size: 26rpx;
  color: #1890ff;
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