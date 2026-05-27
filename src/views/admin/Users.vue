<template>
  <div class="users-container">
    <a-card title="👥 用户管理">
      <!-- 操作栏 -->
      <div class="toolbar">
        <a-space>
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="搜索用户名或ID..."
            style="width: 250px"
            @search="performSearch"
          />
          <a-select
            v-model:value="userType"
            placeholder="用户类型"
            style="width: 150px"
            @change="onFilterChange"
          >
            <a-select-option value="">全部用户</a-select-option>
            <a-select-option value="student">学生</a-select-option>
            <a-select-option value="teacher">教师</a-select-option>
          </a-select>
          <a-button type="primary" @click="showAddModal = true">
            + 新增用户
          </a-button>
        </a-space>
      </div>

      <!-- 用户表格 -->
      <a-table
        :columns="columns"
        :data-source="filteredUsers"
        :pagination="{ pageSize: 10, showTotal: (total) => `共 ${total} 个用户` }"
        bordered
        size="small"
        style="margin-top: 16px"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'index'">
            {{ record.index + 1 }}
          </template>
          <template v-else-if="column.dataIndex === 'type'">
            <a-tag :color="record.type === 'student' ? 'blue' : 'orange'">
              {{ record.type === 'student' ? '学生' : '教师' }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="(record as any).isActive ? 'green' : 'red'">
              {{ (record as any).isActive ? '活跃' : '冻结' }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <a-button-group size="small">
              <a-button type="primary" @click="handleEdit(record)">
                编辑
              </a-button>
              <a-button @click="toggleStatus(record)">
                {{ (record as any).isActive ? '冻结' : '解冻' }}
              </a-button>
              <a-popconfirm
                title="确认删除该用户吗？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="handleDelete(record)"
              >
                <a-button danger>删除</a-button>
              </a-popconfirm>
            </a-button-group>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑弹窗 -->
    <a-modal
      v-model:open="showAddModal"
      :title="editingUser ? '编辑用户' : '新增用户'"
      ok-text="保存"
      cancel-text="取消"
      @ok="handleSave"
    >
      <a-form :model="formData" layout="vertical">
        <a-form-item label="用户类型" required>
          <a-radio-group v-model:value="formData.type" :disabled="!!editingUser">
            <a-radio value="student">学生</a-radio>
            <a-radio value="teacher">教师</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="姓名" required>
          <a-input v-model:value="formData.name" placeholder="请输入姓名" />
        </a-form-item>

        <a-form-item v-if="formData.type === 'student'" label="学号" required>
          <a-input v-model:value="formData.studentId" placeholder="请输入学号" />
        </a-form-item>

        <a-form-item v-if="formData.type === 'student'" label="班级" required>
          <a-input v-model:value="formData.class" placeholder="请输入班级" />
        </a-form-item>

        <a-form-item v-if="formData.type === 'teacher'" label="工号" required>
          <a-input v-model:value="formData.workId" placeholder="请输入工号" />
        </a-form-item>

        <a-form-item label="联系电话" required>
          <a-input v-model:value="formData.phone" placeholder="请输入联系电话" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { useAdminStore } from '@/stores/admin'

const store = useAdminStore()

const searchKeyword = ref('')
const userType = ref('')
const showAddModal = ref(false)
const editingUser = ref(null)

const formData = reactive({
  type: 'student',
  name: '',
  studentId: '',
  class: '',
  workId: '',
  phone: '',
})

const columns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '姓名', dataIndex: 'name', width: 100 },
  { title: '身份', dataIndex: 'type', width: 80 },
  { title: userType.value === 'teacher' ? '工号' : '学号', dataIndex: 'id2', width: 100 },
  { title: '电话', dataIndex: 'phone', width: 120 },
  { title: '状态', dataIndex: 'status', width: 80 },
  { title: '操作', dataIndex: 'actions', width: 200 },
]

const allUsers = computed(() => {
  const students = store.allStudents.map((s, index) => ({
    ...s,
    type: 'student',
    id2: s.studentId,
    index,
  }))
  const teachers = store.allTeachers.map((t, index) => ({
    ...t,
    type: 'teacher',
    id2: t.workId,
    index: students.length + index,
  }))
  return [...students, ...teachers]
})

const filteredUsers = computed(() => {
  let result = allUsers.value

  if (userType.value) {
    result = result.filter((u) => u.type === userType.value)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(keyword) ||
        u.id2.toLowerCase().includes(keyword) ||
        u.phone.includes(keyword),
    )
  }

  return result
})

const performSearch = () => {
  // 搜索逻辑已在computed中实现
}

const onFilterChange = () => {
  // 筛选逻辑已在computed中实现
}

const handleEdit = (user: any) => {
  editingUser.value = user
  formData.type = user.type
  formData.name = user.name
  formData.phone = user.phone
  if (user.type === 'student') {
    formData.studentId = user.studentId
    formData.class = user.class
  } else {
    formData.workId = user.workId
  }
  showAddModal.value = true
}

const handleSave = () => {
  if (!formData.name || !formData.phone) {
    message.error('请填写必要信息')
    return
  }

  if (editingUser.value) {
    if (editingUser.value.type === 'student') {
      store.updateStudent(editingUser.value.id, {
        name: formData.name,
        phone: formData.phone,
        class: formData.class,
      })
    }
    message.success('用户已更新')
  } else {
    if (formData.type === 'student') {
      if (!formData.studentId || !formData.class) {
        message.error('请填写学生信息')
        return
      }
      store.addStudent({
        name: formData.name,
        studentId: formData.studentId,
        class: formData.class,
        phone: formData.phone,
        major: '未指定',
      })
    }
    message.success('用户已添加')
  }

  showAddModal.value = false
  resetForm()
}

const toggleStatus = (user: any) => {
  store.toggleStudentActive(user.id)
  message.success(`用户已${(user as any).isActive ? '冻结' : '激活'}`)
}

const handleDelete = (user: any) => {
  if (user.type === 'student') {
    store.deleteStudent(user.id)
  }
  message.success('用户已删除')
}

const resetForm = () => {
  editingUser.value = null
  formData.type = 'student'
  formData.name = ''
  formData.studentId = ''
  formData.class = ''
  formData.workId = ''
  formData.phone = ''
}
</script>

<style scoped>
.users-container {
  display: flex;
  flex-direction: column;
}

.toolbar {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 16px;
}

:deep(.ant-button-group) {
  display: flex;
  gap: 4px;
}

:deep(.ant-table-small) {
  font-size: 12px;
}
</style>
