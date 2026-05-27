<template>
  <view class="projects-container">
    <view class="header">
      <text class="title">项目管理</text>
      <button class="back-btn" @click="navigateBack">返回</button>
    </view>

    <view class="project-list">
      <view class="project-card" v-for="project in projects" :key="project.id">
        <text class="project-name">{{ project.name }}</text>
        <text class="project-desc">{{ project.description }}</text>
        <text class="project-unit">单位：{{ project.unit }}</text>
        <text class="project-score">满分：{{ project.fullMark }}</text>

        <view class="project-actions">
          <button class="action-btn edit" @click="editProject(project)">
            编辑
          </button>
          <button class="action-btn delete" @click="deleteProject(project.id)">
            删除
          </button>
        </view>
      </view>

      <view class="empty-state" v-if="projects.length === 0">
        <text class="empty-text">暂无项目记录</text>
      </view>
    </view>

    <button class="add-btn" @click="addProject">
      + 添加项目
    </button>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import type { TestProject } from '@/types'

const store = useAdminStore()

const projects = computed(() => store.projects)

const addProject = () => {
  uni.showToast({
    title: '添加项目功能开发中',
    icon: 'none'
  })
}

const editProject = (project: TestProject) => {
  uni.showToast({
    title: '编辑项目功能开发中',
    icon: 'none'
  })
}

const deleteProject = (projectId: string) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该项目吗？',
    success: async (res) => {
      if (res.confirm) {
        const result = await store.deleteProject(projectId)
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
.projects-container {
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

.project-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 100rpx;
}

.project-card {
  background: white;
  padding: 32rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.project-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.project-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
}

.project-unit {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
  display: block;
}

.project-score {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 24rpx;
  display: block;
}

.project-actions {
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