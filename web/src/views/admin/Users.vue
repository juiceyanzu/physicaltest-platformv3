<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { Card, Table, Button, Modal, Input, message, Tag, Select } from 'ant-design-vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()
const activeTab = ref('students')
const isModalVisible = ref(false)
const editingId = ref('')

const formData = reactive({
  name: '',
  gender: '',
  className: '',
  major: '',
  grade: '',
  phone: '',
  username: '',
  role: 'student' as const
})

const searchKey = ref('')

const studentColumns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '性别', dataIndex: 'gender', key: 'gender' },
  { title: '班级', dataIndex: 'class', key: 'class' },
  { title: '专业', dataIndex: 'major', key: 'major' },
  { title: '年级', dataIndex: 'grade', key: 'grade' },
  { title: '联系电话', dataIndex: 'phone', key: 'phone' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action' }
]

const teacherColumns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '职称', dataIndex: 'title', key: 'title' },
  { title: '部门', dataIndex: 'department', key: 'department' },
  { title: '联系电话', dataIndex: 'phone', key: 'phone' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action' }
]

const adminColumns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '用户名', dataIndex: 'username', key: 'username' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action' }
]

const filteredStudents = computed(() => {
  if (!searchKey.value) return adminStore.students
  return adminStore.students.filter(s =>
    s.name.includes(searchKey.value) ||
    s.class?.includes(searchKey.value) ||
    s.major?.includes(searchKey.value)
  )
})

const filteredTeachers = computed(() => {
  if (!searchKey.value) return adminStore.teachers
  return adminStore.teachers.filter((t: any) =>
    t.name.includes(searchKey.value) ||
    (t.username || '').includes(searchKey.value)
  )
})

const filteredAdmins = computed(() => {
  if (!searchKey.value) return adminStore.admins
  return adminStore.admins.filter((a: any) =>
    (a.name || a.nickname || '').includes(searchKey.value) ||
    (a.username || '').includes(searchKey.value)
  )
})

watch(activeTab, async (tab) => {
  if (tab === 'teachers' && adminStore.teachers.length === 0) {
    await adminStore.loadTeachers()
  } else if (tab === 'admins' && adminStore.admins.length === 0) {
    await adminStore.loadAdmins()
  }
})

const showModal = () => {
  editingId.value = ''
  formData.name = ''
  formData.gender = ''
  formData.className = ''
  formData.major = ''
  formData.grade = ''
  formData.phone = ''
  formData.username = ''
  formData.role = activeTab.value === 'students' ? 'student' : activeTab.value === 'teachers' ? 'teacher' : 'admin'
  isModalVisible.value = true
}

const handleEdit = (record: any) => {
  editingId.value = record.id
  formData.name = record.name
  formData.gender = record.gender || ''
  formData.className = record.class || ''
  formData.major = record.major || ''
  formData.grade = record.grade || ''
  formData.phone = record.phone || ''
  formData.username = ''
  formData.role = 'student'
  isModalVisible.value = true
}

const handleEditTeacher = (record: any) => {
  editingId.value = record.id
  formData.name = record.name
  formData.gender = record.gender || ''
  formData.className = record.title || ''
  formData.major = record.department || ''
  formData.grade = ''
  formData.phone = record.phone || ''
  formData.username = ''
  formData.role = 'teacher'
  isModalVisible.value = true
}

const handleDelete = async (type: string, id: string) => {
  if (type === 'student') {
    const result = await adminStore.deleteStudent(id)
    if (result.success) message.success(result.message)
    else message.error(result.message)
  } else if (type === 'teacher') {
    const result = await adminStore.deleteTeacher(id)
    if (result.success) message.success(result.message)
    else message.error(result.message)
  }
}

const handleToggleStatus = async (userId: string, role: string, currentStatus: string) => {
  const action = currentStatus === 'inactive' ? '解冻' : '冻结'
  Modal.confirm({
    title: `确认${action}`,
    content: `确定要${action}该用户吗？`,
    async onOk() {
      const result = await adminStore.toggleUserStatus(userId, role)
      if (result.success) message.success(result.message)
      else message.error(result.message)
    }
  })
}

const handleOk = async () => {
  const name = formData.name.trim()
  if (!name) {
    message.warning('请填写姓名')
    return
  }

  if (activeTab.value === 'students') {
    let result
    if (editingId.value) {
      result = await adminStore.updateStudent(editingId.value, {
        name,
        gender: formData.gender,
        className: formData.className,
        major: formData.major,
        grade: formData.grade,
        phone: formData.phone
      })
    } else {
      if (!formData.phone.trim()) {
        message.warning('请填写联系电话（将作为登录账号）')
        return
      }
      result = await adminStore.createStudent({
        name,
        gender: formData.gender,
        className: formData.className,
        major: formData.major,
        grade: formData.grade,
        phone: formData.phone
      })
    }
    if (result.success) {
      message.success(result.message)
      isModalVisible.value = false
    } else {
      message.error(result.message)
    }
  } else if (activeTab.value === 'teachers') {
    if (!formData.phone.trim() && !editingId.value) {
      message.warning('请填写联系电话（将作为登录账号）')
      return
    }
    let result
    if (editingId.value) {
      result = await adminStore.updateTeacher(editingId.value, {
        name,
        gender: formData.gender,
        title: formData.className,
        department: formData.major,
        phone: formData.phone
      })
    } else {
      result = await adminStore.createTeacher({
        name,
        gender: formData.gender,
        title: formData.className,
        department: formData.major,
        phone: formData.phone
      })
    }
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
  await adminStore.loadStudents()
})
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <h2>用户管理</h2>
      <Button type="primary" @click="showModal">添加{{ activeTab === 'students' ? '学生' : activeTab === 'teachers' ? '教师' : '管理员' }}</Button>
    </div>

    <div style="display: flex; gap: 16px; margin-bottom: 16px;">
      <Input
        v-model:value="searchKey"
        placeholder="搜索姓名、班级、专业..."
        style="width: 300px;"
      />
      <div style="display: flex; background: #f5f5f5; border-radius: 4px; padding: 4px;">
        <button
          @click="activeTab = 'students'"
          :style="{ padding: '8px 24px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: activeTab === 'students' ? '#fff' : 'transparent' }"
        >
          学生 <Tag color="blue">{{ adminStore.students.length }}</Tag>
        </button>
        <button
          @click="activeTab = 'teachers'"
          :style="{ padding: '8px 24px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: activeTab === 'teachers' ? '#fff' : 'transparent' }"
        >
          教师 <Tag color="green">{{ adminStore.teachers.length }}</Tag>
        </button>
        <button
          @click="activeTab = 'admins'"
          :style="{ padding: '8px 24px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: activeTab === 'admins' ? '#fff' : 'transparent' }"
        >
          管理员 <Tag color="red">{{ adminStore.admins.length }}</Tag>
        </button>
      </div>
    </div>

    <Card>
      <Table
        v-if="activeTab === 'students'"
        :columns="studentColumns"
        :data-source="filteredStudents"
        rowKey="id"
        :pagination="{ pageSize: 10 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'gender'">
            {{ record.gender === 'male' ? '男' : record.gender === 'female' ? '女' : '-' }}
          </template>
          <template v-else-if="column.key === 'status'">
            <Tag :color="record.status === 'inactive' ? 'error' : 'success'">
              {{ record.status === 'inactive' ? '冻结' : '正常' }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <Button type="text" @click="handleEdit(record)">编辑</Button>
            <Button type="text" :danger="record.status !== 'inactive'" @click="handleToggleStatus(record.user_id, 'student', record.status)">
              {{ record.status === 'inactive' ? '解冻' : '冻结' }}
            </Button>
            <Button type="text" danger @click="handleDelete('student', record.id)">删除</Button>
          </template>
        </template>
      </Table>
      <Table
        v-else-if="activeTab === 'teachers'"
        :columns="teacherColumns"
        :data-source="filteredTeachers"
        rowKey="id"
        :pagination="{ pageSize: 10 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <Tag :color="record.status === 'inactive' ? 'error' : 'success'">
              {{ record.status === 'inactive' ? '冻结' : '正常' }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <Button type="text" @click="handleEditTeacher(record)">编辑</Button>
            <Button type="text" :danger="record.status !== 'inactive'" @click="handleToggleStatus(record.user_id, 'teacher', record.status)">
              {{ record.status === 'inactive' ? '解冻' : '冻结' }}
            </Button>
            <Button type="text" danger @click="handleDelete('teacher', record.id)">删除</Button>
          </template>
        </template>
      </Table>
      <Table
        v-else
        :columns="adminColumns"
        :data-source="filteredAdmins"
        rowKey="id"
        :pagination="{ pageSize: 10 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <Tag :color="record.status === 'inactive' ? 'error' : 'success'">
              {{ record.status === 'inactive' ? '冻结' : '正常' }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <Button type="text" :danger="record.status !== 'inactive'" @click="handleToggleStatus(record.id, 'admin', record.status)">
              {{ record.status === 'inactive' ? '解冻' : '冻结' }}
            </Button>
          </template>
        </template>
      </Table>
    </Card>

    <Modal
      :title="editingId ? (activeTab === 'students' ? '编辑学生' : '编辑教师') : (activeTab === 'students' ? '添加学生' : '添加教师')"
      :open="isModalVisible"
      @cancel="handleCancel"
      :footer="null"
      width="500px"
    >
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">姓名</label>
          <Input v-model:value="formData.name" placeholder="请输入姓名" style="width: 100%;" />
        </div>

        <template v-if="activeTab === 'students'">
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">性别</label>
            <Select v-model:value="formData.gender" placeholder="请选择性别" style="width: 100%;">
              <Select.Option value="male">男</Select.Option>
              <Select.Option value="female">女</Select.Option>
            </Select>
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">班级</label>
            <Input v-model:value="formData.className" placeholder="请输入班级" style="width: 100%;" />
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">专业</label>
            <Input v-model:value="formData.major" placeholder="请输入专业" style="width: 100%;" />
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">年级</label>
            <Input v-model:value="formData.grade" placeholder="请输入年级" style="width: 100%;" />
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">联系电话 <span style="color: #999; font-size: 12px;">（将作为登录账号，默认密码 123456）</span></label>
            <Input v-model:value="formData.phone" placeholder="请输入联系电话" style="width: 100%;" />
          </div>
        </template>

        <template v-else-if="activeTab === 'teachers'">
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">职称</label>
            <Input v-model:value="formData.className" placeholder="请输入职称" style="width: 100%;" />
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">部门</label>
            <Input v-model:value="formData.major" placeholder="请输入部门" style="width: 100%;" />
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">联系电话 <span style="color: #999; font-size: 12px;">（将作为登录账号，默认密码 123456）</span></label>
            <Input v-model:value="formData.phone" placeholder="请输入联系电话" style="width: 100%;" />
          </div>
        </template>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
          <Button @click="handleCancel">取消</Button>
          <Button type="primary" @click="handleOk">确定</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
