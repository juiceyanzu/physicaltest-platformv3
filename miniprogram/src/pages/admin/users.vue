<template>
  <view class="users-container">
    <view class="header">
      <text class="title">用户管理</text>
      <button class="back-btn" @click="navigateBack">返回</button>
    </view>

    <view class="search-section">
      <input
        class="search-input"
        v-model="searchKeyword"
        placeholder="搜索用户（姓名、学号/工号）"
        placeholder-class="input-placeholder"
        @input="handleSearch"
      />
    </view>

    <view class="filter-section">
      <picker :range="userTypeOptions" :value="selectedUserType" @change="handleTypeChange">
        <view class="picker-content">
          {{ userTypeOptions[selectedUserType] }}
        </view>
      </picker>
    </view>

    <view class="user-list">
      <view class="user-card" v-for="user in filteredUsers" :key="user.id">
        <view class="user-info">
          <text class="user-name">{{ user.name }}</text>
          <text class="user-id">{{ user.studentId || user.workId }}</text>
          <text class="user-class">{{ user.class || user.department }}</text>
          <text class="user-phone">{{ user.phone }}</text>
        </view>
        <view class="user-type" :class="'type-' + user.type">
          {{ user.type === 'student' ? '学生' : '教师' }}
        </view>
        <view class="user-actions">
          <button class="action-btn edit" @click="editUser(user)">
            编辑
          </button>
          <button class="action-btn delete" @click="deleteUser(user.id)">
            删除
          </button>
        </view>
      </view>

      <view class="empty-state" v-if="filteredUsers.length === 0">
        <text class="empty-text">暂无用户记录</text>
      </view>
    </view>

    <button class="add-btn" @click="addUser">
      + 添加用户
    </button>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import type { User } from '@/types'

const store = useAdminStore()
const searchKeyword = ref('')
const selectedUserType = ref(0)

const userTypeOptions = ['全部类型', '学生', '教师']

const users = computed(() => store.users)

const filteredUsers = computed(() => {
  let result = users.value

  // 按类型筛选
  if (selectedUserType.value === 1) {
    result = result.filter(user => user.type === 'student')
  } else if (selectedUserType.value === 2) {
    result = result.filter(user => user.type === 'teacher')
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(user => 
      user.name.toLowerCase().includes(keyword) ||
      (user.studentId && user.studentId.toLowerCase().includes(keyword)) ||
      (user.workId && user.workId.toLowerCase().includes(keyword))
    )
  }

  return result
})

const handleSearch = () => {
  // 搜索逻辑已在 computed 中处理
}

const handleTypeChange = (e: any) => {
  selectedUserType.value = e.detail.value
}

const addUser = () => {
  uni.showToast({
    title: '添加用户功能开发中',
    icon: 'none'
  })
}

const editUser = (user: User) => {
  uni.showToast({
    title: '编辑用户功能开发中',
    icon: 'none'
  })
}

const deleteUser = (userId: string) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该用户吗？',
    success: async (res) => {
      if (res.confirm) {
        const result = await store.deleteUser(userId)
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
.users-container {
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

.search-section {
  margin-bottom: 24rpx;
}

.search-input {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #d9d9d9;
  border-radius: 16rpx;
  padding: 0 32rpx;
  font-size: 28rpx;
  background-color: white;
  box-sizing: border-box;
}

.input-placeholder {
  color: #ccc;
}

.filter-section {
  background: white;
  padding: 24rpx;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.picker-content {
  height: 80rpx;
  border: 2rpx solid #d9d9d9;
  border-radius: 8rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #333;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 100rpx;
}

.user-card {
  background: white;
  padding: 32rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.user-info {
  margin-bottom: 24rpx;
}

.user-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.user-id {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 4rpx;
  display: block;
}

.user-class {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 4rpx;
  display: block;
}

.user-phone {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.user-type {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
  font-weight: bold;
  margin-bottom: 24rpx;
}

.type-student {
  background-color: #e6f7ff;
  color: #1890ff;
}

.type-teacher {
  background-color: #f6ffed;
  color: #52c41a;
}

.user-actions {
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