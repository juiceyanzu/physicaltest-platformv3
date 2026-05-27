<template>
  <div class="notices-container">
    <a-card title="📢 体测公告" class="notices-card">
      <!-- 筛选器 -->
      <div class="filter-bar">
        <a-space wrap>
          <a-button
            v-for="type in noticeTypes"
            :key="type.value"
            :type="selectedType === type.value ? 'primary' : 'default'"
            @click="selectedType = type.value"
          >
            {{ type.label }}
          </a-button>
        </a-space>
      </div>

      <!-- 公告列表 -->
      <a-list :data-source="filteredNotices" :loading="false">
        <template #renderItem="{ item }">
          <a-list-item class="notice-item">
            <router-link :to="`/student/notices/${item.id}`" class="notice-link">
              <a-list-item-meta>
                <template #avatar>
                  <a-tag :color="getNoticeColor(item.type)">{{ getNoticeLabel(item.type) }}</a-tag>
                </template>
                <template #title>
                  <span class="notice-title">{{ item.title }}</span>
                  <a-tag v-if="item.priority === 'high'" color="red">重要</a-tag>
                </template>
                <template #description>
                  <div class="notice-meta">
                    <span class="meta-item">📅 {{ formatDate(item.publishDate) }}</span>
                    <span v-for="tag in item.tags" :key="tag" class="meta-tag">{{ tag }}</span>
                  </div>
                </template>
              </a-list-item-meta>
            </router-link>
          </a-list-item>
        </template>
      </a-list>

      <a-empty v-if="filteredNotices.length === 0" description="暂无公告" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStudentStore } from '@/stores/student'

const store = useStudentStore()
const selectedType = ref('')

const noticeTypes = [
  { value: '', label: '全部' },
  { value: 'schedule', label: '时间安排' },
  { value: 'makeup', label: '补测通知' },
  { value: 'result', label: '成绩公示' },
  { value: 'notice', label: '一般通知' },
]

const filteredNotices = computed(() => {
  if (!selectedType.value) {
    return store.notices
  }
  return store.notices.filter((n) => n.type === selectedType.value)
})

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
</script>

<style scoped>
.notices-container {
  padding-bottom: 80px;
}

.notices-card {
  border-radius: 8px;
}

.filter-bar {
  margin-bottom: 20px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.notice-item {
  padding: 12px 0;
}

.notice-link {
  color: inherit;
  text-decoration: none;
  width: 100%;
}

.notice-link:hover {
  color: #1890ff;
}

.notice-title {
  font-weight: 500;
  font-size: 15px;
}

.notice-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #999;
  font-size: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-tag {
  padding: 2px 8px;
  background: #f0f0f0;
  border-radius: 2px;
  font-size: 11px;
}

:deep(.ant-list-item) {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-list-item:last-child) {
  border-bottom: none;
}

:deep(.ant-list-item-meta-description) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
