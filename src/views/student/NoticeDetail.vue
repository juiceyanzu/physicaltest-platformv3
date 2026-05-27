<template>
  <div class="notice-detail-container">
    <a-button type="text" @click="$router.back()" class="back-btn">← 返回</a-button>

    <a-card v-if="currentNotice" class="detail-card">
      <template #title>
        <div class="detail-header">
          <h1>{{ currentNotice.title }}</h1>
          <div class="header-meta">
            <a-tag :color="getNoticeColor(currentNotice.type)">{{ getNoticeLabel(currentNotice.type) }}</a-tag>
            <a-tag v-if="currentNotice.priority === 'high'" color="red">重要</a-tag>
            <span class="publish-date">📅 {{ formatDate(currentNotice.publishDate) }}</span>
          </div>
        </div>
      </template>

      <div class="detail-content">
        <div class="content-text" v-html="formatContent(currentNotice.content)"></div>

        <div class="tags-section">
          <strong>相关标签:</strong>
          <div class="tags">
            <a-tag v-for="tag in currentNotice.tags" :key="tag">{{ tag }}</a-tag>
          </div>
        </div>
      </div>
    </a-card>

    <a-empty v-else description="公告不存在" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStudentStore } from '@/stores/student'

const route = useRoute()
const store = useStudentStore()

const noticeId = route.params.id as string

const currentNotice = computed(() => store.notices.find((n) => n.id === noticeId))

const getNoticeColor = (type: string) => {
  const colors: Record<string, string> = {
    schedule: 'blue',
    makeup: 'orange',
    result: 'green',
    notice: 'cyan',
  }
  return colors[type] || 'default'
}

const getNoticeLabel = (type: string) => {
  const labels: Record<string, string> = {
    schedule: '时间安排',
    makeup: '补测通知',
    result: '成绩公示',
    notice: '一般通知',
  }
  return labels[type] || type
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const formatContent = (content: string) => {
  return content.split('\n').map((line) => `<p>${line}</p>`).join('')
}
</script>

<style scoped>
.notice-detail-container {
  padding-bottom: 80px;
}

.back-btn {
  margin-bottom: 16px;
  color: #1890ff;
}

.detail-card {
  border-radius: 8px;
}

:deep(.ant-card-head) {
  border-bottom: 1px solid #f0f0f0;
}

.detail-header {
  width: 100%;
}

.detail-header h1 {
  margin: 0 0 12px 0;
  font-size: 24px;
  color: #333;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.publish-date {
  color: #999;
  font-size: 14px;
}

.detail-content {
  padding: 20px 0;
}

.content-text {
  line-height: 1.8;
  color: #333;
  margin-bottom: 20px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.content-text :deep(p) {
  margin: 8px 0;
}

.tags-section {
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
}

.tags {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 响应式 */
@media (max-width: 768px) {
  .detail-header h1 {
    font-size: 20px;
  }
}
</style>
