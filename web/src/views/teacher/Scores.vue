<script setup lang="ts">
import { ref, h, onMounted } from 'vue'
import { Card, Table, Button, Modal, Input, InputNumber, Select, message } from 'ant-design-vue'
import { useTeacherStore } from '@/stores/teacher'

const teacherStore = useTeacherStore()

const isModalVisible = ref(false)
const editingId = ref('')

const form = ref({
  studentId: '',
  projectId: '',
  batchId: '',
  score: 0,
  remarks: ''
})

const columns = [
  { title: '学生姓名', dataIndex: 'studentName', key: 'studentName' },
  { title: '项目', dataIndex: 'projectName', key: 'projectName' },
  { title: '成绩', dataIndex: 'score', key: 'score' },
  { title: '备注', dataIndex: 'remarks', key: 'remarks' },
  { title: '录入时间', dataIndex: 'enteredAt', key: 'enteredAt' },
  {
    title: '操作',
    key: 'action',
    render: (_: any, record: any) => h('div', null, [
      h(Button, { type: 'text', onClick: () => handleEdit(record) }, '编辑'),
      h(Button, { type: 'text', danger: true, onClick: () => handleDelete(record.id) }, '删除')
    ])
  }
]

const showModal = () => {
  editingId.value = ''
  form.value = {
    studentId: '',
    projectId: '',
    batchId: '',
    score: 0,
    remarks: ''
  }
  isModalVisible.value = true
}

const handleEdit = (record: any) => {
  editingId.value = record.id
  const student = teacherStore.students.find((s: any) => s.id === record.studentId || s.name === record.studentName)
  const project = teacherStore.projects.find((p: any) => p.id === record.projectId || p.name === record.projectName)

  form.value = {
    studentId: student?.id || record.studentId || '',
    projectId: project?.id || record.projectId || '',
    batchId: record.batchId || teacherStore.batches[0]?.id || '',
    score: record.score,
    remarks: record.remarks || ''
  }
  isModalVisible.value = true
}

const handleDelete = async (id: string) => {
  const result = await teacherStore.deleteScore(id)
  if (result.success) {
    message.success(result.message)
  } else {
    message.error(result.message)
  }
}

const handleOk = async () => {
  if (!form.value.studentId) {
    message.error('请选择学生')
    return
  }

  if (!form.value.projectId) {
    message.error('请选择项目')
    return
  }

  if (!form.value.batchId) {
    message.error('请选择批次')
    return
  }

  if (editingId.value) {
    const result = await teacherStore.updateScore(editingId.value, {
      score: form.value.score,
      remarks: form.value.remarks
    })
    if (result.success) {
      message.success(result.message)
      isModalVisible.value = false
    } else {
      message.error(result.message)
    }
  } else {
    const result = await teacherStore.createScore({
      studentId: form.value.studentId,
      projectId: form.value.projectId,
      batchId: form.value.batchId,
      score: form.value.score,
      remarks: form.value.remarks
    })
    if (result.success) {
      message.success(result.message)
      isModalVisible.value = false
    } else {
      message.error(result.message)
    }
  }
}

const handleCancel = () => {
  isModalVisible.value = false
}

onMounted(async () => {
  await Promise.all([
    teacherStore.loadStudents(),
    teacherStore.loadProjects(),
    teacherStore.loadBatches(),
    teacherStore.loadScores()
  ])
})
</script>

<template>
  <div style="padding: 24px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <h2>成绩录入</h2>
      <Button type="primary" @click="showModal">录入成绩</Button>
    </div>

    <Card title="成绩列表">
      <Table
        :data-source="teacherStore.scores"
        :columns="columns"
        :pagination="{ pageSize: 10 }"
        :rowKey="(record: any) => record.id"
      />
    </Card>

    <Modal title="录入成绩" :open="isModalVisible" @ok="handleOk" @cancel="handleCancel" width="500px">
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">学生</label>
          <Select v-model:value="form.studentId" placeholder="请选择学生" style="width: 100%;">
            <Select.Option v-for="student in teacherStore.students" :key="student.id" :value="student.id">
              {{ student.name }} - {{ student.class }}
            </Select.Option>
          </Select>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">项目</label>
          <Select v-model:value="form.projectId" placeholder="请选择项目" style="width: 100%;">
            <Select.Option v-for="project in teacherStore.projects" :key="project.id" :value="project.id">
              {{ project.name }} ({{ project.unit }})
            </Select.Option>
          </Select>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">批次</label>
          <Select v-model:value="form.batchId" placeholder="请选择批次" style="width: 100%;">
            <Select.Option v-for="batch in teacherStore.batches" :key="batch.id" :value="batch.id">
              {{ batch.name }}
            </Select.Option>
          </Select>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">成绩</label>
          <InputNumber v-model:value="form.score" :min="0" :max="100" placeholder="请输入成绩" style="width: 100%;" />
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">备注</label>
          <Input v-model:value="form.remarks" placeholder="请输入备注" style="width: 100%;" />
        </div>
      </div>
    </Modal>
  </div>
</template>
