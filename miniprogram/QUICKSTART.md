# 小程序快速开始指南

## 第一步：安装依赖

在 miniprogram 目录下运行：

```bash
cd miniprogram
npm install
```

## 第二步：配置 AppID

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 注册小程序账号（如果没有）
3. 在"开发" -> "开发设置"中获取 AppID
4. 编辑 `manifest.json` 文件，填入 AppID：

```json
{
  "mp-weixin": {
    "appid": "你的AppID"
  }
}
```

## 第三步：启动开发服务器

```bash
npm run dev:mp-weixin
```

## 第四步：在微信开发者工具中打开

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开微信开发者工具
3. 选择"导入项目"
4. 项目目录选择：`miniprogram/dist/dev/mp-weixin`
5. 填入 AppID
6. 点击"导入"

## 第五步：开始开发

现在你可以在微信开发者工具中看到小程序的运行效果，可以开始进行开发和调试。

## 常用命令

```bash
# 开发微信小程序
npm run dev:mp-weixin

# 构建微信小程序
npm run build:mp-weixin

# 开发 H5
npm run dev:h5

# 构建 H5
npm run build:h5
```

## 目录说明

```
miniprogram/
├── pages/              # 页面文件
│   ├── student/       # 学生端页面
│   ├── teacher/       # 教师端页面（待开发）
│   └── admin/         # 管理端页面（待开发）
├── stores/            # 状态管理
├── types/             # 类型定义
├── static/            # 静态资源
├── App.vue            # 应用入口
├── main.js            # 主文件
├── manifest.json      # 应用配置
└── pages.json         # 页面配置
```

## 页面路由

### 学生端

- 登录页：`/pages/student/login`
- 首页：`/pages/student/home`
- 预约页：`/pages/student/appointments`
- 我的预约：`/pages/student/my-appointments`
- 成绩页：`/pages/student/scores`
- 公告列表：`/pages/student/notices`
- 公告详情：`/pages/student/notice-detail`
- 个人中心：`/pages/student/profile`

## 测试账号

### 学生账号
- 学号：2026001
- 密码：任意密码

## 注意事项

1. **首次运行**：确保已安装 Node.js 和 npm
2. **网络问题**：如果 npm 安装慢，可以使用淘宝镜像：
   ```bash
   npm install --registry=https://registry.npmmirror.com
   ```
3. **真机调试**：在微信开发者工具中点击"真机调试"按钮
4. **预览**：点击"预览"按钮生成二维码，手机扫码查看

## 下一步

- 查看 [README.md](./README.md) 了解详细功能
- 查看 [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) 了解迁移细节
- 开始开发新功能或修改现有功能

## 遇到问题？

1. 查看控制台错误信息
2. 检查网络连接
3. 确认 AppID 配置正确
4. 查看官方文档：
   - [uni-app 文档](https://uniapp.dcloud.net.cn/)
   - [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

祝你开发顺利！🚀