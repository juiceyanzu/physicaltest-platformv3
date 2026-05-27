<script setup lang="ts">
import { ref, onMounted, h, computed } from 'vue'
import { Card, Table, Button, Modal, Input, InputNumber, message, Tag, Select, Switch } from 'ant-design-vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()
const isModalVisible = ref(false)
const editingId = ref('')
const searchKey = ref('')

const formData = ref({
  name: '',
  unit: '',
  genderRequirement: 'all',
  minScore: 0,
  maxScore: 100,
  isRequired: true,
})

const columns = [
  { title: '项目名称', dataIndex: 'name', key: 'name' },
  { title: '单位', dataIndex: 'unit', key: 'unit' },
  {
    title: '性别要求',
    dataIndex: 'genderRequirement',
    key: 'genderRequirement',
    render: (g: string) => {
      const texts: Record<string, string> = { all: '全部', male: '男', female: '女' }
      return texts[g] || g
    }
  },
  { title: '最低分', dataIndex: 'minScore', key: 'minScore' },
  { title: '最高分', dataIndex: 'maxScore', key: 'maxScore' },
  {
    title: '是否必填',
    dataIndex: 'isRequired',
    key: 'isRequired',
    render: (r: boolean) => h(Switch, { checked: r, disabled: true })
  },
  {
    title: '操作',
    key: 'action',
    render: (_: any, record: any) => h('div', null, [
      h(Button, { type: 'text', onClick: () => handleEdit(record) }, '编辑'),
      h(Button, { type: 'text', danger: true, onClick: () => handleDelete(record.id) }, '删除')
    ])
  }
]

const filteredProjects = computed(() => {
  if (!searchKey.value) return adminStore.projects
  return adminStore.projects.filter(p => p.name.includes(searchKey.value))
})

const showModal = () => {
  editingId.value = ''
  formData.value = {
    name: '',
    unit: '',
    genderRequirement: 'all',
    minScore: 0,
    maxScore: 100,
    isRequired: true,
  }
  isModalVisible.value = true
}

const handleEdit = (record: any) => {
  editingId.value = record.id
  formData.value = {
    name: record.name,
    unit: record.unit,
    genderRequirement: record.genderRequirement,
    minScore: record.minScore,
    maxScore: record.maxScore,
    isRequired: record.isRequired !== undefined ? record.isRequired : true,
  }
  isModalVisible.value = true
}

const handleDelete = async (id: string) => {
  const result = await adminStore.deleteProject(id)
  if (result.success) {
    message.success(result.message)
  } else {
    message.error(result.message)
  }
}

const handleOk = async () => {
  const name = formData.value.name.trim()
  if (!name) {
    message.warning('请填写项目名称')
    return
  }

  if (Number(formData.value.minScore) > Number(formData.value.maxScore)) {
    message.warning('最低分不能高于最高分')
    return
  }

  let result
  if (editingId.value) {
    result = await adminStore.updateProject(editingId.value, formData.value)
  } else {
    result = await adminStore.createProject(formData.value)
  }

  if (result.success) {
    message.success(result.message)
    isModalVisible.value = false
  } else {
    message.error(result.message)
  }
}

const handleCancel = () => {
  isModalVisible.value = false
}

onMounted(async () => {
  await adminStore.loadProjects()
})
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <h2>项目管理</h2>
      <Button type="primary" @click="showModal">添加项目</Button>
    </div>

    <div style="display: flex; gap: 16px; margin-bottom: 16px;">
      <Input
        v-model:value="searchKey"
        placeholder="搜索项目名称..."
        style="width: 300px;"
      />
    </div>

    <Card>
      <Table
        :columns="columns"
        :data-source="filteredProjects"
        rowKey="id"
        :pagination="{ pageSize: 10 }"
      />
    </Card>

    <Modal
      :title="editingId ? '编辑项目' : '添加项目'"
      :open="isModalVisible"
      @ok="handleOk"
      @cancel="handleCancel"
      width="500px"
    >
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">项目名称</label>
          <Input v-model:value="formData.name" placeholder="请输入项目名称" style="width: 100%;" />
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">单位</label>
          <Input v-model:value="formData.unit" placeholder="请输入单位" style="width: 100%;" />
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">性别要求</label>
          <Select v-model:value="formData.genderRequirement" style="width: 100%;">
            <Select.Option value="all">全部</Select.Option>
            <Select.Option value="male">男</Select.Option>
            <Select.Option value="female">女</Select.Option>
          </Select>
        </div>
        <div style="display: flex; gap: 16px; margin-bottom: 16px;">
          <div style="flex: 1;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">最低分</label>
            <InputNumber v-model:value="formData.minScore" :min="0" :max="1000" placeholder="最低分" style="width: 100%;" />
          </div>
          <div style="flex: 1;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">最高分</label>
            <InputNumber v-model:value="formData.maxScore" :min="0" :max="1000" placeholder="最高分" style="width: 100%;" />
          </div>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">是否必填</label>
          <Switch v-model:checked="formData.isRequired" />
        </div>
      </div>
    </Modal>
  </div>
</template>
