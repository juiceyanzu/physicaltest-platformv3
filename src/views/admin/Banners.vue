<template>
  <div class="manage-container">
    <a-card title="🖼️ 轮播图管理">
      <div class="toolbar">
        <a-button type="primary" @click="showAddModal = true">+ 上传轮播图</a-button>
      </div>

      <a-table :columns="columns" :data-source="banners" :pagination="{ pageSize: 10 }" bordered size="small" style="margin-top: 16px">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
          <template v-else-if="column.dataIndex === 'imageUrl'">
            <img :src="record.imageUrl" alt="banner" style="max-width: 100px; max-height: 60px" />
          </template>
          <template v-else-if="column.dataIndex === 'isActive'">
            <a-tag :color="record.isActive ? 'green' : 'red'">{{ record.isActive ? '显示' : '隐藏' }}</a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <a-button-group size="small">
              <a-button @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm title="确认删除？" ok-text="确认" cancel-text="取消" @confirm="handleDelete(record.id)">
                <a-button danger>删除</a-button>
              </a-popconfirm>
            </a-button-group>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑弹窗 -->
    <a-modal v-model:open="showAddModal" :title="editingId ? '编辑轮播图' : '上传轮播图'" ok-text="保存" cancel-text="取消" @ok="handleSave" width="600px">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="轮播图标题" required>
          <a-input v-model:value="formData.title" placeholder="请输入轮播图标题" />
        </a-form-item>
        <a-form-item label="图片URL" required>
          <a-input v-model:value="formData.imageUrl" placeholder="请输入图片链接" />
        </a-form-item>
        <a-form-item label="链接地址">
          <a-input v-model:value="formData.linkUrl" placeholder="点击图片跳转到（可选）" />
        </a-form-item>
        <a-form-item label="显示" required>
          <a-checkbox v-model:checked="formData.isActive">启用此轮播图</a-checkbox>
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

const showAddModal = ref(false)
const editingId = ref('')

const formData = reactive({
  title: '',
  imageUrl: '',
  linkUrl: '',
  isActive: true,
})

const columns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '标题', dataIndex: 'title', width: 150 },
  { title: '图片预览', dataIndex: 'imageUrl', width: 150 },
  { title: '显示状态', dataIndex: 'isActive', width: 100 },
  { title: '操作', dataIndex: 'actions', width: 150 },
]

const banners = computed(() => store.banners)

const handleEdit = (banner: any) => {
  editingId.value = banner.id
  formData.title = banner.title
  formData.imageUrl = banner.imageUrl
  formData.linkUrl = banner.linkUrl || ''
  formData.isActive = banner.isActive
  showAddModal.value = true
}

const handleSave = () => {
  if (!formData.title || !formData.imageUrl) {
    message.error('请填写必要信息')
    return
  }

  if (editingId.value) {
    store.updateBanner(editingId.value, {
      title: formData.title,
      imageUrl: formData.imageUrl,
      linkUrl: formData.linkUrl || undefined,
      isActive: formData.isActive,
    })
    message.success('轮播图已更新')
  } else {
    store.addBanner({
      title: formData.title,
      imageUrl: formData.imageUrl,
      linkUrl: formData.linkUrl || undefined,
      isActive: formData.isActive,
    })
    message.success('轮播图已上传')
  }

  showAddModal.value = false
  editingId.value = ''
}

const handleDelete = (id: string) => {
  store.deleteBanner(id)
  message.success('轮播图已删除')
}
</script>

<style scoped>
.manage-container {
  display: flex;
  flex-direction: column;
}

.toolbar {
  margin-bottom: 16px;
}

:deep(.ant-button-group) {
  display: flex;
  gap: 4px;
}
</style>
