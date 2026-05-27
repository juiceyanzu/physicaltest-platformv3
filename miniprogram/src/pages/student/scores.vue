<template>
  <view class="scores-container">
    <view class="stats-summary">
      <view class="stat-item">
        <text class="stat-label">平均分</text>
        <text class="stat-value">{{ userStats.averageScore }}</text>
      </view>
      <view class="stat-item">
        <text class="stat-label">总记录</text>
        <text class="stat-value">{{ userStats.totalScores }}</text>
      </view>
      <view class="stat-item">
        <text class="stat-label">最高分</text>
        <text class="stat-value">{{ highestScore }}</text>
      </view>
    </view>

    <view class="score-list">
      <view class="score-card" v-for="score in scores" :key="score.id">
        <view class="score-header">
          <text class="score-title">{{ score.batchName }}</text>
          <view class="score-level" :class="'level-' + score.level">
            {{ score.level }}
          </view>
        </view>

        <view class="score-info">
          <text class="info-item">📅 {{ score.testDate }}</text>
          <text class="info-item">总分：{{ score.totalScore }}分</text>
        </view>

        <view class="score-items">
          <view class="score-item" v-for="(item, index) in score.items" :key="index">
            <text class="item-name">{{ item.name }}</text>
            <view class="item-score">
              <text class="score-value" :class="getScoreClass(item.score)">
                {{ item.score || '--' }}
              </text>
              <text class="score-remarks" v-if="item.remarks">{{ item.remarks }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="empty-state" v-if="scores.length === 0">
        <text class="empty-text">暂无成绩记录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useStudentStore } from '@/stores/student'
import { getToken } from '@/api'

const store = useStudentStore()
const scoresList = ref<any[]>([])
const userStatsData = reactive({ totalAppointments: 0, completedAppointments: 0, totalScores: 0, averageScore: 0 })

onShow(async () => {
  if (!store.state.user && getToken()) {
    await store.getProfile()
  }
  await store.loadScores()
  await store.loadAppointments()
  scoresList.value = store.state.scores.slice()
  const stats = store.userStats
  Object.assign(userStatsData, stats)
})

const scores = computed(() => scoresList.value)
const userStats = computed(() => userStatsData)

const highestScore = computed(() => {
  if (scores.value.length === 0) return 0
  return Math.max(...scores.value.map(s => s.totalScore))
})

const getScoreClass = (score: number | null) => {
  if (score === null) return 'score-null'
  if (score >= 90) return 'score-excellent'
  if (score >= 80) return 'score-good'
  if (score >= 60) return 'score-pass'
  return 'score-fail'
}
</script>

<style scoped>
.scores-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.stats-summary {
  display: flex;
  justify-content: space-between;
  background: #667eea;
  padding: 40rpx;
  border-radius: 24rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12rpx;
}

.stat-value {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: white;
}

.score-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.score-card {
  background: white;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.score-title {
  flex: 1;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-right: 16rpx;
}

.score-level {
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: bold;
}

.level-excellent {
  background-color: #f6ffed;
  color: #52c41a;
}

.level-good {
  background-color: #e6f7ff;
  color: #1890ff;
}

.level-pass {
  background-color: #fffbe6;
  color: #faad14;
}

.level-fail {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.score-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 24rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-item {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.score-items {
  display: flex;
  flex-direction: column;
}

.score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx dashed #f0f0f0;
}

.score-item:last-child {
  border-bottom: none;
}

.item-name {
  font-size: 28rpx;
  color: #333;
}

.item-score {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.score-value {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 4rpx;
}

.score-excellent {
  color: #52c41a;
}

.score-good {
  color: #1890ff;
}

.score-pass {
  color: #faad14;
}

.score-fail {
  color: #ff4d4f;
}

.score-null {
  color: #999;
}

.score-remarks {
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