<template>
  <view class="banners-container">
    <view class="header">
      <text class="title">横幅管理</text>
      <button class="back-btn" @click="navigateBack">返回</button>
    </view>

    <view class="banner-list">
      <view class="banner-card" v-for="banner in banners" :key="banner.id">
        <view class="banner-image">
          <image :src="banner.image" mode="aspectFill"></image>
        </view>
        <text class="banner-title">{{ banner.title }}</text>
        <text class="banner-link">{{ banner.link }}</text>
        <text class="banner-priority">优先级：{{ banner.priority }}</text>
        <view class="banner-status" :class="'status-' + banner.status">
          {{ banner.status === 'active' ? '启用' : '禁用' }}
        </view>

        <view class="banner-actions">
          <button class="action-btn edit" @click="editBanner(banner)">
            编辑
          </button>
          <button class="action-btn delete" @click="deleteBanner(banner.id)">
            删除
          </button>
        </view>
      </view>

      <view class="empty-state" v-if="banners.length === 0">
        <text class="empty-text">暂无横幅记录</text>
      </view>
    </view>

    <button class="add-btn" @click="addBanner">
      + 添加横幅
    </button>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import type { Banner } from '@/types'

const store = useAdminStore()

const banners = computed(() => store.banners)

const addBanner = () => {
  uni.showToast({
    title: '添加横幅功能开发中',
    icon: 'none'
  })
}

const editBanner = (banner: Banner) => {
  uni.showToast({
    title: '编辑横幅功能开发中',
    icon: 'none'
  })
}

const deleteBanner = (bannerId: string) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该横幅吗？',
    success: async (res) => {
      if (res.confirm) {
        const result = await store.deleteBanner(bannerId)
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
.banners-container {
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

.banner-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 100rpx;
}

.banner-card {
  background: white;
  padding: 32rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.banner-image {
  width: 100%;
  height: 200rpx;
  margin-bottom: 24rpx;
  border-radius: 8rpx;
  overflow: hidden;
}

.banner-image image {
  width: 100%;
  height: 100%;
}

.banner-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
  display: block;
}

.banner-link {
  font-size: 24rpx;
  color: #1890ff;
  margin-bottom: 8rpx;
  display: block;
  word-break: break-all;
}

.banner-priority {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: block;
}

.banner-status {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
  font-weight: bold;
  margin-bottom: 24rpx;
}

.status-active {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-inactive {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.banner-actions {
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