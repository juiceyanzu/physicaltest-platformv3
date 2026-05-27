<template>
  <div class="home-container">
    <!-- 欢迎卡片 -->
    <a-card class="welcome-card">
      <template #title>
        <div class="welcome-header">
          <div>
            <h2>👋 欢迎, {{ currentUser?.name }}!</h2>
            <p class="welcome-subtitle">{{ greeting }}</p>
          </div>
        </div>
      </template>
      <div class="welcome-content">
        <p>
          <span class="info-label">学号:</span>
          <span>{{ currentUser?.studentId }}</span>
        </p>
        <p>
          <span class="info-label">班级:</span>
          <span>{{ currentUser?.class }}</span>
        </p>
        <p>
          <span class="info-label">专业:</span>
          <span>{{ currentUser?.major }}</span>
        </p>
      </div>
    </a-card>

    <!-- 快速统计 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">{{ userStats.confirmedAppointments }}</div>
        <div class="stat-label">已预约</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ userStats.completedAppointments }}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ userStats.totalScores }}</div>
        <div class="stat-label">测试次数</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ userStats.averageScore }}</div>
        <div class="stat-label">平均分</div>
      </div>
    </div>

    <!-- 功能导航 -->
    <div class="feature-grid">
      <router-link to="/student/notices" class="feature-card">
        <div class="feature-icon">📢</div>
        <div class="feature-title">体测公告</div>
        <div class="feature-desc">查看最新的体测时间、通知</div>
      </router-link>

      <router-link to="/student/appointments" class="feature-card">
        <div class="feature-icon">📅</div>
        <div class="feature-title">预约体测</div>
        <div class="feature-desc">选择合适的时段预约</div>
      </router-link>

      <router-link to="/student/my-appointments" class="feature-card">
        <div class="feature-icon">✓</div>
        <div class="feature-title">我的预约</div>
        <div class="feature-desc">查看、管理已预约信息</div>
      </router-link>

      <router-link to="/student/scores" class="feature-card">
        <div class="feature-icon">📊</div>
        <div class="feature-title">体测成绩</div>
        <div class="feature-desc">查看历次测试成绩</div>
      </router-link>

      <router-link to="/student/profile" class="feature-card">
        <div class="feature-icon">👤</div>
        <div class="feature-title">个人中心</div>
        <div class="feature-desc">管理个人信息</div>
      </router-link>

      <a href="javascript:void(0)" class="feature-card" @click="handleShowHelp">
        <div class="feature-icon">❓</div>
        <div class="feature-title">帮助中心</div>
        <div class="feature-desc">了解使用指南</div>
      </a>
    </div>

    <!-- 最新公告预览 -->
    <a-card class="latest-notices" title="📋 最新公告">
      <a-list :data-source="latestNotices" :loading="false">
        <template #renderItem="{ item }">
          <a-list-item>
            <router-link :to="`/student/notices/${item.id}`" class="notice-link">
              <a-list-item-meta>
                <template #avatar>
                  <a-tag :color="getNoticeColor(item.type)">{{ getNoticeLabel(item.type) }}</a-tag>
                </template>
                <template #title>
                  {{ item.title }}
                </template>
                <template #description>
                  {{ formatDate(item.publishDate) }}
                </template>
              </a-list-item-meta>
            </router-link>
          </a-list-item>
        </template>
      </a-list>

      <div class="view-more">
        <router-link to="/student/notices">查看全部公告 →</router-link>
      </div>
    </a-card>

    <!-- 帮助弹窗 -->
    <a-modal v-model:open="helpVisible" title="帮助中心" :footer="null" width="600px">
      <div class="help-content">
        <h3>如何使用体测预约平台？</h3>
        <ol>
          <li>
            <strong>查看公告</strong>：在"体测公告"页面查看体测时间安排和注意事项
          </li>
          <li>
            <strong>预约体测</strong>：进入"预约体测"页面，选择适合的时段进行预约
          </li>
          <li>
            <strong>管理预约</strong>：在"我的预约"页面查看已预约的时段，支持取消预约
          </li>
          <li>
            <strong>查看成绩</strong>：体测完成后，在"体测成绩"页面查看成绩评价
          </li>
          <li>
            <strong>个人中心</strong>：管理个人信息、查看统计数据
          </li>
        </ol>

        <h3>常见问题</h3>
        <div class="faq">
          <details>
            <summary>📌 如何取消已预约的时段？</summary>
            <p>进入"我的预约"页面，找到要取消的预约记录，点击"取消预约"按钮即可。</p>
          </details>
          <details>
            <summary>📌 如果错过了预约时间怎么办？</summary>
            <p>可以参加补测，补测时间会在"体测公告"中发布。</p>
          </details>
          <details>
            <summary>📌 体测成绩如何评分？</summary>
            <p>体测总分100分，由6个项目组成，每项满分20分。</p>
          </details>
        </div>

        <h3>联系我们</h3>
        <p>
          <strong>体育教学部</strong>
          <br />
          📞 电话：0551-63612345
          <br />
          📧 邮箱：pec@example.edu.cn
          <br />
          🏢 地址：体育馆1楼201室
        </p>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStudentStore } from '@/stores/student'

const store = useStudentStore()
const helpVisible = ref(false)

const currentUser = computed(() => store.currentUser)
const userStats = computed(() => store.userStats)
const latestNotices = computed(() => store.notices.slice(0, 3))

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早上好，祝你体测顺利！'
  if (hour < 18) return '下午好，继续加油！'
  return '晚上好，记得查看最新通知！'
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

const handleShowHelp = () => {
  helpVisible.value = true
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 80px;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

:deep(.welcome-card .ant-card-head) {
  border-bottom: none;
  padding-bottom: 0;
}

:deep(.welcome-card .ant-card-body) {
  background: white;
  color: #333;
}

.welcome-header {
  color: white;
}

.welcome-header h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
}

.welcome-subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.welcome-content p {
  margin: 8px 0;
}

.info-label {
  font-weight: bold;
  margin-right: 8px;
  color: #1890ff;
}

/* 快速统计 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.stat-card {
  background: white;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-left: 4px solid #1890ff;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

/* 功能导航 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.feature-card {
  background: white;
  padding: 20px 16px;
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.feature-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.feature-title {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}

/* 最新公告 */
.latest-notices {
  margin-top: 20px;
}

:deep(.ant-list-item) {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-list-item:last-child) {
  border-bottom: none;
}

.notice-link {
  color: inherit;
  text-decoration: none;
  width: 100%;
}

.notice-link:hover {
  color: #1890ff;
}

.view-more {
  text-align: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.view-more a {
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
}

.view-more a:hover {
  text-decoration: underline;
}

/* 帮助内容 */
.help-content {
  color: #333;
}

.help-content h3 {
  margin-top: 16px;
  margin-bottom: 12px;
  font-size: 16px;
  color: #1890ff;
}

.help-content ol {
  padding-left: 24px;
}

.help-content li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.faq {
  margin-top: 12px;
}

.faq details {
  margin-bottom: 8px;
  cursor: pointer;
}

.faq summary {
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  user-select: none;
}

.faq summary:hover {
  background: #efefef;
}

.faq p {
  padding: 8px 16px;
  margin: 0;
  line-height: 1.6;
  color: #666;
}

/* 响应式 */
@media (max-width: 768px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
