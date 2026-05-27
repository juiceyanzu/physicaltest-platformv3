<template>
  <view class="score-entry-container">
    <view class="header">
      <text class="title">成绩录入</text>
      <button class="back-btn" @click="navigateBack">返回</button>
    </view>

    <view class="student-info">
      <text class="info-label">学生信息</text>
      <view class="info-card">
        <text class="info-item">姓名：{{ studentName }}</text>
        <text class="info-item">批次：{{ batchName }}</text>
        <text class="info-item">日期：{{ batchDate }}</text>
      </view>
    </view>

    <view class="score-form">
      <text class="form-label">体测项目</text>
      
      <view class="score-items">
        <view class="score-item" v-for="(item, index) in scoreItems" :key="index">
          <text class="item-name">{{ item.name }}</text>
          <input
            class="score-input"
            type="number"
            v-model.number="item.score"
            placeholder="请输入成绩"
            placeholder-class="input-placeholder"
          />
          <input
            class="remarks-input"
            v-model="item.remarks"
            placeholder="备注"
            placeholder-class="input-placeholder"
          />
        </view>
      </view>

      <view class="total-section">
        <text class="total-label">总分</text>
        <text class="total-score">{{ totalScore }}</text>
        <text class="level">等级：{{ level }}</text>
      </view>

      <button 
        class="submit-btn" 
        :loading="loading"
        @click="submitScore"
      >
        {{ loading ? '提交中...' : '提交成绩' }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useTeacherStore } from '@/stores/teacher'

const store = useTeacherStore()
const loading = ref(false)

const studentId = ref('')
const batchId = ref('')
const studentName = ref('学生姓名')
const batchName = ref('体测批次')
const batchDate = ref('测试日期')

const scoreItems = ref([
  { name: '身高体重', score: null as number | null, remarks: '' },
  { name: '肺活量', score: null as number | null, remarks: '' },
  { name: '50米跑', score: null as number | null, remarks: '' },
  { name: '坐位体前屈', score: null as number | null, remarks: '' },
  { name: '1000米跑', score: null as number | null, remarks: '' },
  { name: '引体向上', score: null as number | null, remarks: '' },
])

const totalScore = computed(() => {
  const sum = scoreItems.value.reduce((total, item) => {
    return total + (item.score || 0)
  }, 0)
  return sum
})

const level = computed(() => {
  const score = totalScore.value
  if (score >= 540) return 'excellent'
  if (score >= 480) return 'good'
  if (score >= 360) return 'pass'
  return 'fail'
})

const submitScore = async () => {
  const hasEmpty = scoreItems.value.some(item => item.score === null)
  if (hasEmpty) {
    uni.showToast({
      title: '请填写所有项目的成绩',
      icon: 'none'
    })
    return
  }

  loading.value = true
  try {
    const result = await store.enterScore({
      studentId: studentId.value,
      batchId: batchId.value,
      items: scoreItems.value.map(item => ({
        name: item.name,
        score: item.score!,
        remarks: item.remarks
      }))
    })
    uni.showToast({
      title: result.message,
      icon: result.success ? 'success' : 'none'
    })

    if (result.success) {
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  } finally {
    loading.value = false
  }
}

const navigateBack = () => {
  uni.navigateBack()
}

onShow(async () => {
  await Promise.all([
    store.loadStudents(),
    store.loadBatches(),
    store.loadProjects(),
    store.loadScores()
  ])

  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options

  if (options.studentId) {
    studentId.value = options.studentId
    const student = store.students.find((s: any) => s.id === options.studentId)
    if (student) {
      studentName.value = student.name || student.student_name || options.studentId
    }
  }
  if (options.batchId) {
    batchId.value = options.batchId
    const batch = store.batches.find((b: any) => b.id === options.batchId)
    if (batch) {
      batchName.value = batch.name || ''
      batchDate.value = batch.date || batch.start_date || ''
    }
  }

  const existingScore = store.scores.find((s: any) =>
    s.studentId === studentId.value && s.batchId === batchId.value
  )
  if (existingScore && existingScore.items) {
    scoreItems.value = existingScore.items
  }
})
</script>

<style scoped>
.score-entry-container {
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

.student-info {
  margin-bottom: 32rpx;
}

.info-label {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.info-card {
  background: white;
  padding: 32rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.info-item {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
}

.score-form {
  background: white;
  padding: 32rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.form-label {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
  display: block;
}

.score-items {
  margin-bottom: 32rpx;
}

.score-item {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.score-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.item-name {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  margin-right: 20rpx;
}

.score-input {
  width: 120rpx;
  height: 80rpx;
  border: 2rpx solid #d9d9d9;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  margin-right: 20rpx;
  text-align: center;
}

.remarks-input {
  flex: 2;
  height: 80rpx;
  border: 2rpx solid #d9d9d9;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.input-placeholder {
  color: #ccc;
}

.total-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32rpx;
  padding-top: 24rpx;
  border-top: 2rpx solid #f0f0f0;
}

.total-label {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.total-score {
  font-size: 48rpx;
  font-weight: bold;
  color: #1890ff;
}

.level {
  font-size: 28rpx;
  color: #666;
  font-weight: bold;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: bold;
  letter-spacing: 4rpx;
}

.submit-btn::after {
  border: none;
}
</style>