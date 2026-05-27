<template>
  <div class="scores-container">
    <a-card title="📊 体测成绩" class="scores-card">
      <a-empty v-if="userScores.length === 0" description="暂无成绩记录" />

      <a-list v-else :data-source="userScores">
        <template #renderItem="{ item, index }">
          <a-list-item class="score-item">
            <a-list-item-meta>
              <template #avatar>
                <a-tag :color="item.status === 'pass' ? 'green' : 'red'">
                  {{ item.status === 'pass' ? '合格' : '不合格' }}
                </a-tag>
              </template>
              <template #title>
                <span class="score-date">📅 {{ formatDate(item.testDate) }}</span>
              </template>
              <template #description>
                <div class="score-details">
                  <div class="score-row">
                    <span class="score-label">总分:</span>
                    <span class="score-value" :class="{ 'score-high': item.totalScore >= 80 }">
                      {{ item.totalScore }}/{{ item.maxTotalScore }}
                    </span>
                  </div>
                </div>
              </template>
            </a-list-item-meta>

            <template #actions>
              <a-button type="text" @click="expandedIndex = expandedIndex === index ? -1 : index">
                {{ expandedIndex === index ? '隐藏详情' : '查看详情' }}
              </a-button>
            </template>
          </a-list-item>

          <!-- 详情展开 -->
          <div v-if="expandedIndex === index" class="score-details-expanded">
            <a-table :columns="itemColumns" :data-source="item.items" :pagination="false" size="small">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'score'">
                  <span :class="{ 'score-high': record.score > record.maxScore * 0.8 }">
                    {{ record.score }}/{{ record.maxScore }}
                  </span>
                </template>
                <template v-else-if="column.dataIndex === 'grade'">
                  <a-tag :color="getGradeColor(record.grade)">{{ record.grade }}</a-tag>
                </template>
              </template>
            </a-table>

            <div class="remarks" v-if="item.remarks">
              <strong>备注:</strong> {{ item.remarks }}
            </div>
          </div>
        </template>
      </a-list>

      <!-- 评分标准 -->
      <a-card title="📋 评分标准参考" class="scoring-guide" style="margin-top: 20px">
        <a-table :columns="gradeColumns" :data-source="gradingStandard" :pagination="false" size="small">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'grade'">
              <a-tag :color="getGradeColor(record.grade)">{{ record.grade }}</a-tag>
            </template>
          </template>
        </a-table>
      </a-card>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStudentStore } from '@/stores/student'

const store = useStudentStore()
const expandedIndex = ref(-1)

const userScores = computed(() => store.scores.sort((a, b) =>
  new Date(b.testDate).getTime() - new Date(a.testDate).getTime()
))

const itemColumns = [
  {
    title: '项目',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '得分',
    dataIndex: 'score',
    key: 'score',
  },
  {
    title: '等级',
    dataIndex: 'grade',
    key: 'grade',
  },
]

const gradeColumns = [
  {
    title: '等级',
    dataIndex: 'grade',
    key: 'grade',
  },
  {
    title: '分数范围',
    dataIndex: 'scoreRange',
    key: 'scoreRange',
  },
  {
    title: '说明',
    dataIndex: 'description',
    key: 'description',
  },
]

const gradingStandard = [
  {
    grade: 'A',
    scoreRange: '17-20分',
    description: '优秀',
  },
  {
    grade: 'B',
    scoreRange: '14-16分',
    description: '良好',
  },
  {
    grade: 'C',
    scoreRange: '11-13分',
    description: '及格',
  },
  {
    grade: 'D',
    scoreRange: '0-10分',
    description: '不及格',
  },
]

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const getGradeColor = (grade: string) => {
  const colors: Record<string, string> = {
    A: 'green',
    B: 'blue',
    C: 'orange',
    D: 'red',
  }
  return colors[grade] || 'default'
}
</script>

<style scoped>
.scores-container {
  padding-bottom: 80px;
}

.scores-card {
  border-radius: 8px;
}

.score-item {
  padding: 16px 0 !important;
  border-bottom: 1px solid #f0f0f0;
}

.score-date {
  font-weight: 500;
  font-size: 15px;
  color: #333;
}

.score-details {
  margin-top: 8px;
}

.score-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #666;
}

.score-label {
  font-weight: 500;
  color: #333;
}

.score-value {
  font-weight: bold;
  color: #1890ff;
}

.score-value.score-high {
  color: #52C41A;
}

.score-details-expanded {
  background: #f5f5f5;
  padding: 16px;
  margin: 12px 0;
  border-radius: 4px;
}

.remarks {
  margin-top: 12px;
  padding: 12px;
  background: white;
  border-left: 3px solid #1890ff;
}

.scoring-guide {
  background: #fafafa;
  border: 1px solid #f0f0f0;
}

:deep(.ant-table) {
  background: white;
}

/* 响应式 */
@media (max-width: 768px) {
  .score-row {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
}
</style>
