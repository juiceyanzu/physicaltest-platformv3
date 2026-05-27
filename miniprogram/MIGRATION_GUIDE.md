# 体测平台 Web 转 uni-app 小程序迁移指南

## 项目概述
将现有的 Vue 3 Web 项目转换为 uni-app 微信小程序项目，保留所有功能。

## 技术栈对比

### Web 项目
- Vue 3 + TypeScript
- Vue Router
- Pinia 状态管理
- Ant Design Vue UI 组件库
- Vite 构建工具

### 小程序项目
- Vue 3 + TypeScript
- uni-app 框架
- Pinia 状态管理
- uni-app 原生组件
- Vite 构建工具

## 迁移步骤

### 1. 项目结构对比

#### Web 项目结构
```
src/
├── assets/
├── components/
├── layouts/
├── router/
├── stores/
├── types/
├── utils/
├── views/
├── App.vue
└── main.ts
```

#### 小程序项目结构
```
miniprogram/
├── pages/
│   ├── student/
│   ├── teacher/
│   └── admin/
├── components/
├── stores/
├── types/
├── utils/
├── static/
├── App.vue
├── main.js
├── manifest.json
└── pages.json
```

### 2. 主要变更点

#### 路由系统
- **Web**: Vue Router (`/student/home`)
- **小程序**: uni-app 页面路由 (`pages/student/home`)

#### UI 组件
- **Web**: Ant Design Vue (`<a-button>`, `<a-input>`)
- **小程序**: uni-app 原生组件 (`<button>`, `<input>`)

#### 样式单位
- **Web**: px
- **小程序**: rpx (响应式像素)

#### API 调用
- **Web**: `axios`
- **小程序**: `uni.request`

#### 存储
- **Web**: `localStorage`
- **小程序**: `uni.setStorage` / `uni.getStorage`

#### 导航
- **Web**: `router.push()`
- **小程序**: `uni.navigateTo()`

### 3. 组件迁移映射

#### Ant Design Vue → uni-app 组件

| Ant Design Vue | uni-app | 说明 |
|----------------|---------|------|
| `<a-button>` | `<button>` | 按钮组件 |
| `<a-input>` | `<input>` | 输入框 |
| `<a-form>` | `<form>` | 表单 |
| `<a-table>` | 自定义组件 | 表格需要自定义 |
| `<a-modal>` | `<uni-popup>` | 弹窗 |
| `<a-message>` | `uni.showToast()` | 消息提示 |
| `<a-divider>` | 自定义分割线 | 分割线 |
| `<a-card>` | 自定义卡片 | 卡片容器 |
| `<a-select>` | `<picker>` | 选择器 |
| `<a-date-picker>` | `<picker mode="date">` | 日期选择 |
| `<a-upload>` | `<uni-file-picker>` | 文件上传 |

### 4. 页面迁移清单

#### 学生端页面
- [x] Login.vue → pages/student/login.vue
- [x] Home.vue → pages/student/home.vue
- [x] Notices.vue → pages/student/notices.vue
- [x] NoticeDetail.vue → pages/student/notice-detail.vue
- [x] Appointments.vue → pages/student/appointments.vue
- [x] MyAppointments.vue → pages/student/my-appointments.vue
- [x] Scores.vue → pages/student/scores.vue
- [x] Profile.vue → pages/student/profile.vue

#### 教师端页面
- [x] Login.vue → pages/teacher/login.vue
- [x] Dashboard.vue → pages/teacher/dashboard.vue
- [x] Appointments.vue → pages/teacher/appointments.vue
- [x] ScoreEntry.vue → pages/teacher/score-entry.vue

#### 管理端页面
- [x] Login.vue → pages/admin/login.vue
- [x] Dashboard.vue → pages/admin/dashboard.vue
- [x] Users.vue → pages/admin/users.vue
- [x] Projects.vue → pages/admin/projects.vue
- [x] Batches.vue → pages/admin/batches.vue
- [x] Notices.vue → pages/admin/notices.vue
- [x] Banners.vue → pages/admin/banners.vue

### 5. 状态管理迁移

Pinia store 保持不变，只需要调整存储方式：

```typescript
// Web 项目
localStorage.setItem('currentUser', JSON.stringify(user))

// 小程序项目
uni.setStorageSync('currentUser', user)
```

### 6. 微信登录适配

#### Web 项目
- 使用微信开放平台 OAuth 2.0
- 二维码扫码登录
- 网页授权

#### 小程序项目
- 使用微信小程序登录 API
- `uni.login()` 获取 code
- `uni.getUserInfo()` 获取用户信息
- 直接授权，无需扫码

### 7. 权限和 API 适配

#### 需要申请的权限
- 用户信息
- 位置信息（如需要）
- 相机（如需要）
- 文件存储（如需要）

#### API 适配示例

```typescript
// 网络请求
const response = await uni.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  data: {}
})

// 消息提示
uni.showToast({
  title: '操作成功',
  icon: 'success'
})

// 页面跳转
uni.navigateTo({
  url: '/pages/student/home'
})

// 存储数据
uni.setStorageSync('key', 'value')

// 获取存储数据
const value = uni.getStorageSync('key')
```

### 8. 开发和调试

#### 开发命令
```bash
# 安装依赖
npm install

# 微信小程序开发
npm run dev:mp-weixin

# 构建微信小程序
npm run build:mp-weixin
```

#### 调试工具
- 微信开发者工具
- 真机调试
- 远程调试

### 9. 上线流程

1. 在微信公众平台注册小程序
2. 获取 AppID
3. 配置服务器域名
4. 提交审核
5. 发布上线

### 10. 注意事项

1. **包大小限制**: 小程序主包不能超过 2MB，总包不能超过 20MB
2. **API 限制**: 部分浏览器 API 在小程序中不可用
3. **样式适配**: 使用 rpx 单位适配不同屏幕
4. **兼容性**: 注意不同版本微信的兼容性
5. **性能优化**: 合理使用分包加载
6. **用户体验**: 遵循小程序设计规范

### 11. 测试清单

- [ ] 所有页面正常显示
- [ ] 登录功能正常
- [ ] 表单提交正常
- [ ] 列表加载正常
- [ ] 详情页跳转正常
- [ ] 权限控制正常
- [ ] 状态管理正常
- [ ] 错误处理正常
- [ ] 微信登录正常
- [ ] 网络请求正常

### 12. 后续优化

1. 性能优化（代码分包、懒加载）
2. 用户体验优化（加载动画、错误提示）
3. 功能增强（推送通知、分享功能）
4. 数据统计（用户行为分析）
5. 安全加固（数据加密、权限验证）

## 快速开始

```bash
# 1. 安装依赖
cd miniprogram
npm install

# 2. 配置 AppID
# 编辑 manifest.json，填入你的微信小程序 AppID

# 3. 开发调试
npm run dev:mp-weixin

# 4. 在微信开发者工具中打开 dist/dev/mp-weixin 目录
```

## 技术支持

- uni-app 官方文档: https://uniapp.dcloud.net.cn/
- 微信小程序文档: https://developers.weixin.qq.com/miniprogram/dev/framework/
- Vue 3 文档: https://cn.vuejs.org/